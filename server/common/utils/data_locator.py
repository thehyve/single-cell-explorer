import os
import tempfile
from datetime import datetime
from urllib.parse import urlparse

import boto3
import botocore
import fsspec


class DataLocator:
    """
    DataLocator is a simple wrapper around fsspec functionality, and provides a
    set of functions to encapsulate a data location (URI or path), interogate
    metadata about the object at that location (size, existance, etc) and
    access the underlying data.

    https://filesystem-spec.readthedocs.io/en/latest/index.html

    Example:
        dl = DataLocator("/tmp/foo.cxg")
        if dl.exists():
            print(dl.size())
            with dl.open() as f:
                thecontents = f.read()

    DataLocator will accept a URI or native path.  Error handling is as defined
    in fsspec.

    """

    def __init__(self, uri_or_path, region_name=None):  # type: ignore
        if isinstance(uri_or_path, DataLocator):
            locator = uri_or_path
            self.uri_or_path = locator.uri_or_path  # type: ignore
            self.protocol = locator.protocol  # type: ignore
            self.path = locator.path  # type: ignore
            self.cname = locator.cname  # type: ignore
        else:
            self.uri_or_path = uri_or_path
            self.protocol, self.path = DataLocator._get_protocol_and_path(uri_or_path)  # type: ignore
            # work-around for LocalFileSystem not treating file: and None as the same scheme/protocol
            self.cname = self.path if self.protocol == "file" else self.uri_or_path

        # fsspec.filesystem will throw RuntimeError if the protocol is unsupported
        if self.protocol == "s3":
            if region_name:
                config_kwargs = dict(region_name=region_name)
                self.fs = fsspec.filesystem(self.protocol, listings_expiry_time=30, config_kwargs=config_kwargs)
            else:
                self.fs = fsspec.filesystem(self.protocol, listings_expiry_time=30)
        else:
            self.fs = fsspec.filesystem(self.protocol)

    def __repr__(self):  # type: ignore
        return (
            f"DataLocator(protocol={self.protocol}, cname={self.cname}, "
            f"path={self.path}, uri_or_path={self.uri_or_path})"
        )

    @staticmethod
    def _get_protocol_and_path(uri_or_path):  # type: ignore
        if "://" in uri_or_path:
            protocol, path = uri_or_path.split("://", 1)
            # windows!!!  Ignore single letter drive identifiers,
            # eg, G:\foo.txt
            if len(protocol) > 1:
                return protocol, path
        return None, uri_or_path

    def exists(self):  # type: ignore
        return self.fs.exists(self.cname)

    def size(self):  # type: ignore
        return self.fs.size(self.cname)

    def lastmodtime(self):  # type: ignore
        """return datetime object representing last modification time, or None if unavailable"""
        info = self.fs.info(self.cname)
        if self.islocal() and info is not None:  # type: ignore
            return datetime.fromtimestamp(info["mtime"])
        else:
            return getattr(info, "LastModified", None)

    def abspath(self):  # type: ignore
        """
        return the absolute path for the locator - only really does something
        for file: protocol, as all others are already absolute
        """
        if self.islocal():  # type: ignore
            return os.path.abspath(self.path)
        else:
            return self.uri_or_path

    def isfile(self):  # type: ignore
        return self.fs.isfile(self.cname)

    def open(self, *args):  # type: ignore
        return self.fs.open(
            self.uri_or_path,
        )

    def islocal(self):  # type: ignore
        return self.protocol is None or self.protocol == "file"

    def local_handle(self):  # type: ignore
        if self.islocal():  # type: ignore
            return LocalFilePath(self.path)  # type: ignore

        # if not local, create a tmp file system object to contain the data,
        # and clean it up when done.  If the path has a suffix/extension,
        # do our best to create a file with the same.
        ext = os.path.splitext(self.path)
        suffix = None if ext[1] == "" else ext[1]
        with self.open() as src, tempfile.NamedTemporaryFile(prefix="cellxgene_", suffix=suffix, delete=False) as tmp:  # type: ignore
            tmp.write(src.read())
            tmp.close()
            src.close()
            tmp_path = tmp.name
            return LocalFilePath(tmp_path, delete=True)  # type: ignore

    def ls(self):  # type: ignore
        paths = self.fs.ls(self.uri_or_path)
        return [os.path.basename(p) for p in paths]


class LocalFilePath:
    def __init__(self, tmp_path, delete=False):  # type: ignore
        self.tmp_path = tmp_path
        self.delete = delete

    def __enter__(self):  # type: ignore
        return self.tmp_path

    def __exit__(self, *args):  # type: ignore
        if self.delete:
            os.unlink(self.tmp_path)


def discover_s3_region_name(uri):  # type: ignore
    """If this is an s3 protocol, discover and return the (aws) region name.
    If a return name could not be discovered, or if the uri is not an s3 protocol, return None."""

    protocol, _ = DataLocator._get_protocol_and_path(uri)  # type: ignore
    if protocol == "s3":
        bucket = urlparse(uri).netloc
        client = boto3.client("s3")
        try:
            res = client.head_bucket(Bucket=bucket)
        except botocore.exceptions.ClientError:
            return None

        region = res.get("ResponseMetadata", {}).get("HTTPHeaders", {}).get("x-amz-bucket-region")
        if region:
            return region
        else:
            return None
    return None
