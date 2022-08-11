# automatically generated by the FlatBuffers compiler, do not modify

# namespace: NetEncoding

import flatbuffers


class Uint32Array(object):
    __slots__ = ["_tab"]

    @classmethod
    def GetRootAsUint32Array(cls, buf, offset):
        n = flatbuffers.encode.Get(flatbuffers.packer.uoffset, buf, offset)
        x = Uint32Array()
        x.Init(buf, n + offset)
        return x

    # Uint32Array
    def Init(self, buf, pos):
        self._tab = flatbuffers.table.Table(buf, pos)

    # Uint32Array
    def Data(self, j):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(4))
        if o != 0:
            a = self._tab.Vector(o)
            return self._tab.Get(
                flatbuffers.number_types.Uint32Flags, a + flatbuffers.number_types.UOffsetTFlags.py_type(j * 4)
            )
        return 0

    # Uint32Array
    def DataAsNumpy(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(4))
        if o != 0:
            return self._tab.GetVectorAsNumpy(flatbuffers.number_types.Uint32Flags, o)
        return 0

    # Uint32Array
    def DataLength(self):
        o = flatbuffers.number_types.UOffsetTFlags.py_type(self._tab.Offset(4))
        if o != 0:
            return self._tab.VectorLen(o)
        return 0


def Uint32ArrayStart(builder):
    builder.StartObject(1)


def Uint32ArrayAddData(builder, data):
    builder.PrependUOffsetTRelativeSlot(0, flatbuffers.number_types.UOffsetTFlags.py_type(data), 0)


def Uint32ArrayStartDataVector(builder, numElems):
    return builder.StartVector(4, numElems, 4)


def Uint32ArrayEnd(builder):
    return builder.EndObject()
