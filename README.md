# CZ CELLxGENE Explorer
_an interactive explorer for single-cell transcriptomics data_

This repo contains a fork of CZ CELLxGENE Annotate called CZ CELLxGENE Explorer which is deployed as part of CZ CELLxGENE Discover to enable exploration of datasets published on that platform.

[![Push Tests](https://github.com/chanzuckerberg/single-cell-explorer/workflows/Push%20Tests/badge.svg)](https://github.com/chanzuckerberg/single-cell-explorer/actions?query=workflow%3A%22Push+Tests%22)
![Code Coverage](https://codecov.io/gh/chanzuckerberg/single-cell-explorer/branch/main/graph/badge.svg)

CZ CELLxGENE Explorer (pronounced "cell-by-gene") is an interactive data explorer for single-cell transcriptomics datasets, such as those coming from the [Human Cell Atlas](https://humancellatlas.org). Leveraging modern web development techniques to enable fast visualizations of at least 1 million cells, we hope to enable biologists and computational researchers to explore their data.

Whether you need to visualize one thousand cells or one million, CELLxGENE Explorer helps you gain insight into your single-cell data.

## Getting started

### The comprehensive guide to CZ CELLxGENE

[The CZ CELLxGENE documentation is your one-stop-shop for information about CELLxGENE](/docs)!

### Supported browsers

CZ CELLxGENE Explorer currently supports the following browsers:

- Google Chrome 61+
- Edge 15+
- Firefox 60+

Please [file an issue](https://github.com/chanzuckerberg/single-cell-explorer/issues/new/choose) if you would like us to add support for an unsupported browser.

### Finding help

We'd love to hear from you!
For questions, suggestions, or accolades, [join the `#cellxgene-users` channel on the CZI Science Slack](https://join-cellxgene-users.herokuapp.com/) and say "hi!".

For any errors, [report bugs on Github](https://github.com/chanzuckerberg/single-cell-explorer/issues/new/choose).

# Developing with CZ CELLxGENE Explorer

### Contributing

Please see our [contributing guide](https://github.com/chanzuckerberg/cellxgene-documentation/blob/main/contribute.md) and don't hesitate to open an issue or send a pull request to improve CZ CELLxGENE Explorer. Please see the [dev_docs](https://github.com/chanzuckerberg/single-cell-explorer/blob/main/dev_docs) for pull request suggestions, unit test details, local documentation preview, and other development specifics. 

This project adheres to the Contributor Covenant [code of conduct](https://github.com/chanzuckerberg/.github/blob/master/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to opensource@chanzuckerberg.com.

### Reuse

This project was started with the sole goal of empowering the scientific community to explore and understand their data. 
As such, we encourage other scientific tool builders in academia or industry to adopt the patterns, tools, and code from 
this project. All code is freely available for reuse under the [MIT license](https://opensource.org/licenses/MIT).


Before extending CZ CELLxGENE Explorer, we encourage you to reach out to us with ideas or questions. It might be possible that an 
extension could be added directly to the Explorer repo, which would make it available for a wider audience, or that it's on our 
[roadmap](https://github.com/chanzuckerberg/cellxgene-documentation/blob/main/roadmap.md) and under active development. 

See the [CELLxGENE extensions](https://github.com/chanzuckerberg/cellxgene-documentation/blob/main/community-extensions.md) section of our documentation for examples of community use and CELLxGENE extensions. 

### Security

If you believe you have found a security issue, we would appreciate notification. Please send email to <security@chanzuckerberg.com>.

# Inspiration

We've been heavily inspired by several other related single-cell visualization projects, including the [UCSC Cell Browser](http://cells.ucsc.edu/), [Cytoscape](http://www.cytoscape.org/), [Xena](https://xena.ucsc.edu/), [ASAP](https://asap.epfl.ch/), [GenePattern](http://genepattern-notebook.org/), and many others. We hope to explore collaborations where useful as this community works together on improving interactive visualization for single-cell data.

We were inspired by Mike Bostock and the [crossfilter](https://github.com/crossfilter) team for the design of our filtering implementation.

We have been working closely with the [scanpy](https://github.com/theislab/scanpy) team to integrate with their awesome analysis tools. Special thanks to Alex Wolf, Fabian Theis, and the rest of the team for their help during development and for providing an example dataset.

We are eager to explore integrations with other computational backends such as [Seurat](https://github.com/satijalab/seurat) or [Bioconductor](https://github.com/Bioconductor)
