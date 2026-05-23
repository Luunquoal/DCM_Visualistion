enum DCM_Block_Type{
    NUMBER_ARRAY,
    STRING,
    STRING_ARRAY,
    VECTOR_3
}

enum DCM_Data_Element_Reading_Type{
    UINT8_Array,
    UINT16_ARRAY,
    UINT32_ARRAY,
    UINT64_ARRAY,
    SINT16_ARRAY,
    SINT32_ARRAY,
    SINT64_ARRAY,
    FLOAT_ARRAY,
    DOUBLE_ARRAY,
    STRING_ARRAY,
    CHAR_ARRAY,
    TAG_ARRAY
}

export class DE_Tag{
    public group : number;
    public element : number;
    constructor(group : number, element : number){
        this.group = group;
        this.element = element;
    }
}

export class DE<T extends VR>{
    public tag : DE_Tag;
    public data : T;

    constructor(tag : DE_Tag, data : T){
        this.tag = tag;
        this.data = data;
    }
}

//#region value representation

abstract class VR{
    public data : any;
    public reader : DE_Reader;

    constructor(data : any, reader : DE_Reader){
        this.data = data;
        this.reader = reader;
    }
}

export class OB extends VR{
    declare data : Uint8Array;
    declare reader : Byte_Array_DE_Reader;

    constructor(data : Uint8Array, reader : Byte_Array_DE_Reader){
        super(data, reader);
    }
}

//#endregion

//#region reader

abstract class DE_Reader{
    static process_byte_array(byte_data : Uint8Array) : any {};
}

export class Number_Array_DE_Reader extends DE_Reader{
    static override process_byte_array(byte_data : Uint8Array) : number[]{
        throw new Error();
    }
}

export class Byte_Array_DE_Reader extends DE_Reader{
    process_byte_array(byte_data : Uint8Array) : Uint8Array{
        throw new Error();
    }
}

//#endregion

function test(){
    var a = new OB(new Uint8Array(2), new Byte_Array_DE_Reader());
    Byte_Array_DE_Reader.process_byte_array
}