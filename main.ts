import * as THREE from 'three/webgpu';

const img_elements : HTMLCollectionOf<HTMLImageElement> = document.getElementsByTagName("img");
const input_elements : HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName("input");
const paragraph_elements : HTMLCollectionOf<HTMLParagraphElement> = document.getElementsByTagName("p");


function check_or_cry<T extends HTMLElement>(list : HTMLCollectionOf<T>, id : string) : T {
    const element = list.namedItem(id);
    if(element != undefined) return element;
    else throw new Error(`no  with id \"${id}\" in document!`);
}

const myImage : HTMLImageElement = check_or_cry(img_elements, "myImage");
const myRequest = new Request("flowers.jpg");

// fetching file based on request

fetch(myRequest)
.then((response) => {
    if (!response.ok) {
    throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.blob();
})
.then((myBlob) => {
    const objectURL = URL.createObjectURL(myBlob);
    if(myImage instanceof HTMLImageElement) myImage.src = objectURL;
    else throw new Error("expected image element");
})
.catch((error) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(`Error: ${error.message}`));
    document.body.insertBefore(p, myImage);
});

// read dcm files in blocks through through input

const dcmInput = check_or_cry(input_elements, "dcm-in");
const dcmOutput = check_or_cry(paragraph_elements, "dcm-out");

dcmInput.addEventListener('change', handleFileSelect);

function handleFileSelect(ev : Event) {
    const target = ev.target;
    if(ev.type == "change" ){

        if(ev.target){

            if(ev.target instanceof HTMLInputElement){

                if(ev.target.files){

                    const file = ev.target.files[0];
                    if(!file){
                        dcmOutput.textContent = "no file selected.";
                        return;
                    }
                    readDcm(file);
                }
            }
        }
    }
}

function concat_Uint8Arrays(a : Uint8Array, b : Uint8Array) : Uint8Array{
    var new_arr = new Uint8Array(a.byteLength + b.byteOffset);
    new_arr.set(a);
    new_arr.set(b, a.byteLength);
    return new_arr;
}

function readDcm(file : File) {
    console.log("found file");
    const stream : ReadableStream = file.stream();
    let back_buffer : Uint8Array = new Uint8Array(0);
    let is_start : boolean = false;
    const blocksplitter = new TransformStream({
        start() {},

        transform(chunk , controller) {
            //chunk = await chunk;
            if(chunk.length == 0){
                controller.terminate();
            } else {
                back_buffer = concat_Uint8Arrays(back_buffer, chunk)
                const offset = back_buffer.byteLength;
                /*
                const chunkview = new DataView(back_buffer, offset, chunk.byteLength);
                for (let index = 0; index < chunk.byteLength; index++) {
                    chunkview.setUint8(index, chunk.getUint8(index));
                }
                */
                const cd = {arr: back_buffer, is_start: is_start };
                processDCMchunk(cd, controller) ;
                
            }
        },

        flush(){

        }
    });

    stream.pipeThrough(blocksplitter).pipeTo(appendToDOMStream(dcmOutput));
}

function appendToDOMStream(el : HTMLParagraphElement){
    return new WritableStream({
        write(chunk){
            const buffer = new Uint8Array(chunk);
            buffer.forEach((b) => {
                el.append(String.fromCharCode(b));
            })
        }
    });
}

// reading drag and dropped files
/*
const myFileInput = document.getElementById("dcm-in")


function readFile(file) {
  return new Response(file).arrayBuffer();
}

document
  .querySelector("input[type=file]")
  .addEventListener("change", (event) => {
    const file = event.target.files[0];
    const buffer = readFile(file);
  });

  

window.addEventListener("dragover", (ev) => {
    const fileItems = [...ev.dataTransfer.items].filter(
       (item) => item.kind === "file",
    );
    if(fileItems.length > 0){
        ev.preventDefault();
        console.log("hello");
    }
});

window.addEventListener("drop", dropHandler);


function dropHandler(ev : Event) {
    ev.preventDefault();
    if(ev.target){
        if(ev.target instanceof HTMLInputElement){

        }
    }
    const files = [...ev.dataTransfer.items]
        .map((item) => item.getAsFile())
        .filter((file) => file);
    console.log(files);
}
    */


function arrayBufferToString(buffer : ArrayBuffer) : string {
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(buffer));
}

const testdcmdata = new Uint8Array([
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x44, 0x49, 0x43, 0x4D, 0x02, 0x00, 0x00, 0x00, 0x55, 0x4C, 0x04, 0x00, 0xC2, 0x00, 0x00, 0x00, 
    0x02, 0x00, 0x01, 0x00, 0x4F, 0x42, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x00, 
    0x02, 0x00, 0x55, 0x49, 0x1A, 0x00, 0x31, 0x2E, 0x32, 0x2E, 0x38, 0x34, 0x30, 0x2E, 0x31, 0x30, 
    0x30, 0x30, 0x38, 0x2E, 0x35, 0x2E, 0x31, 0x2E, 0x34, 0x2E, 0x31, 0x2E, 0x31, 0x2E, 0x32, 0x00, 
    0x02, 0x00, 0x03, 0x00, 0x55, 0x49, 0x38, 0x00, 0x31, 0x2E, 0x33, 0x2E, 0x36, 0x2E, 0x31, 0x2E, 
    0x34, 0x2E, 0x31, 0x2E, 0x31, 0x39, 0x32, 0x39, 0x31, 0x2E, 0x32, 0x2E, 0x31, 0x2E, 0x33, 0x2E, 
    0x31, 0x31, 0x34, 0x30, 0x31, 0x33, 0x33, 0x31, 0x34, 0x34, 0x33, 0x32, 0x31, 0x39, 0x37, 0x35, 
    0x38, 0x35, 0x34, 0x37, 0x39, 0x33, 0x32, 0x37, 0x39, 0x32, 0x37, 0x36, 0x31, 0x39, 0x30, 0x37, 
    0x02, 0x00, 0x10, 0x00, 0x55, 0x49, 0x14, 0x00, 0x31, 0x2E, 0x32, 0x2E, 0x38, 0x34, 0x30, 0x2E, 
    0x31, 0x30, 0x30, 0x30, 0x38, 0x2E, 0x31, 0x2E, 0x32, 0x2E, 0x31, 0x00, 0x02, 0x00, 0x12, 0x00, 
    0x55, 0x49, 0x1C, 0x00, 0x31, 0x2E, 0x32, 0x2E, 0x32, 0x37, 0x36, 0x2E, 0x30, 0x2E, 0x37, 0x32, 
    0x33, 0x30, 0x30, 0x31, 0x30, 0x2E, 0x33, 0x2E, 0x30, 0x2E, 0x33, 0x2E, 0x36, 0x2E, 0x31, 0x00, 
    0x02, 0x00, 0x13, 0x00, 0x53, 0x48, 0x0A, 0x00, 0x4F, 0x53, 0x49, 0x52, 0x49, 0x58, 0x5F, 0x33, 
    0x36, 0x31, 
]);

// create text encoder
const encoder = new TextEncoder();
// create ArrayBuffer from data
const myBuf = testdcmdata.buffer;//encoder.encode("Hello ArrayBuffer").buffer;
// create views
const introview = new DataView(myBuf, 128);

outputline(arrayBufferToString(myBuf.slice(128, 132)));
processDCM(myBuf);

function processDCM(dcmbuffer : ArrayBuffer){
	outputline("processing file");
    const introtext = arrayBufferToString(dcmbuffer.slice(128,132));
    
	if(introtext == "DICM"){
    	let index = 132;
    	outputline("file very probably dcm");
        
        while(index < dcmbuffer.byteLength - (8 + 4)){ // are there enough bytes remaining for a data block info and 
            let exceding_buffer_len : boolean = false;
        	// create block info view
			const blockinfoview = new DataView(dcmbuffer, index, 8);
            // read group
            let group : number= blockinfoview.getUint16(0, true);
            // read element
            let element : number= blockinfoview.getUint16(2, true);
            // read type
            let type : string = String.fromCharCode(blockinfoview.getUint8(4)) + String.fromCharCode(blockinfoview.getUint8(5));
            // read length
            let blockdatalen : number = blockinfoview.getUint16(6, true);
            var extra_data_len_bytes : number = blockdatalen != 0 ? 0 : 4;
            exceding_buffer_len = index + 8 + extra_data_len_bytes > dcmbuffer.byteLength;
            if(exceding_buffer_len) break;
            // get length from next four bytes if previous length was 0
            if(extra_data_len_bytes == 4){
                const extra_len_view = new DataView(dcmbuffer, index + 8, extra_data_len_bytes);
                blockdatalen = extra_len_view.getUint32(0,true);
            }
            outputline("group: " + group);
            outputline("element: " + element);
            outputline("type: " + type);
            outputline("length: " + blockdatalen);
            
            // check if remaining length is enough to process the blocks content
            exceding_buffer_len = index + 8 + extra_data_len_bytes + blockdatalen > dcmbuffer.byteLength;
            if(exceding_buffer_len) break;
            
            // fill blockdata
            const dcm_block = new DCM_Block( group, element, type, blockdatalen);

          	let blockdata : ArrayBuffer = new ArrayBuffer(blockdatalen + 8);
            const blockdataview = new DataView(dcmbuffer, index + 8 + extra_data_len_bytes, blockdatalen);
            switch(type){
            	case "UL":
                	blockdata = blockdataview.getUint32(0, true);
                	break;
            }
            
          	outputline(blockdata);
            
            index = 500;
        	outputline("index: " + index + "; buffer byte length: " + dcmbuffer.byteLength + ";");
            
        }
    }
}

function processDCMchunk(file_content_data : {arr : Uint8Array, is_start : boolean}, controller : TransformStreamDefaultController) {
    let index : number = 0;
    // check if we are still at the beginning of the file
    // if so try processing the beginning and set the index according
    // enter while loop
    // try process blocks repeateadly
    // only check group, element and length data to stop the process if for example pixel data has been reached
    // enqueue block for further processing
    // once done with the loop cut of processed part of the array and set it to
    controller.enqueue(/* some block here */);

    return file_content_data;
}

enum DCM_Block_Type{
    NUMBER_ARRAY,
    STRING,
    STRING_ARRAY,
    VECTOR_3
}

enum DCM_Block_Reading_Type{
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

class DCM_Block{
    public bgroup : number;
    public belement : number;
    public block_reading_type : DCM_Block_Reading_Type;
    public block_type : DCM_Block_Type;
    public block_byte_length : number;
    private s_data : string = "";
    private sa_data : string[] = [];
    private na_data : number[] = [];
    private vec_data : number[] = [0,0,0];

    constructor(
        bgroup : number,
        belement : number,
        block_reading_type : string,
        blength : number
    ){
        this.bgroup = bgroup;
        this.belement = belement;
        this.block_reading_type = this.get_block_reading_type(block_reading_type);
        this.block_type = this.get_block_type(bgroup, belement, this.block_reading_type);
        this.block_byte_length = blength;
    }

    private get_block_reading_type(type_string : string ) : DCM_Block_Reading_Type{
        var result! : DCM_Block_Reading_Type;
        switch(type_string){
            //#region string cases
            //#region string array separated by \
            case "AE":
            case "AS":
            case "CS":
            case "DA": 
            case "DS":
            case "DT": 
            case "IS": 
            case "LO":
            case "PN": 
            case "SH": 
            case "TM":
            case "UC": 
            case "UI": 
                result = DCM_Block_Reading_Type.STRING_ARRAY;
                break;
            //#endregion
            //#region explicitly char array
            case "LT":
            case "ST":
            case "UR":
            case "UT":
                result = DCM_Block_Reading_Type.CHAR_ARRAY;
                break;
            //#endregion
            //#region Tag array
            case "AT":
                result = DCM_Block_Reading_Type.TAG_ARRAY;
                break;
            //#endregion
            //#endregion
            //#region numbers
            //#region floating points
            case "FL":
            case "OF":
                result = DCM_Block_Reading_Type.FLOAT_ARRAY;
                break;
            case "FD":
            case "OD":
                result = DCM_Block_Reading_Type.DOUBLE_ARRAY;
                break;
            //#endregion
            //#region uint
            case "OW":
            case "US":
                result = DCM_Block_Reading_Type.UINT16_ARRAY;
                break;
            case "OL":
            case "UL":
                result = DCM_Block_Reading_Type.UINT32_ARRAY;
                break;
            case "OV":
            case "UV":
                result = DCM_Block_Reading_Type.UINT64_ARRAY;
                break;
            //#endregion
            //#region sint
            case "SS":
                result = DCM_Block_Reading_Type.SINT16_ARRAY;
                break;
            case "SL":
                result = DCM_Block_Reading_Type.SINT32_ARRAY;
                break;
            case "SV":
                result = DCM_Block_Reading_Type.SINT64_ARRAY;
                break;
            //#endregion
            //#endregion
            //#region byte array
            case "OB":
            case "UN":
                result = DCM_Block_Reading_Type.UINT8_Array;
                break;
            //#endregion
        }
        if (result != undefined) return result;
        else throw new Error(`Block reading type could not be inferred from the given type string \"${type_string}\"!`);
    }

    private get_block_type(group : number, element : number , block_reading_type : DCM_Block_Reading_Type) : DCM_Block_Type {
        var result! : DCM_Block_Type
        // known blocks
        switch({group, element}){
            case {group:0, element:1}:

        }

        // unknown blocks
        if(result == undefined){
            switch (block_reading_type) {
                case DCM_Block_Reading_Type.FLOAT_ARRAY:
                case DCM_Block_Reading_Type.DOUBLE_ARRAY:
                case DCM_Block_Reading_Type.UINT16_ARRAY:
                case DCM_Block_Reading_Type.UINT32_ARRAY:
                case DCM_Block_Reading_Type.UINT64_ARRAY:
                case DCM_Block_Reading_Type.SINT16_ARRAY:
                case DCM_Block_Reading_Type.SINT32_ARRAY:
                case DCM_Block_Reading_Type.SINT64_ARRAY:
                    result = DCM_Block_Type.NUMBER_ARRAY;
                    break;
                case DCM_Block_Reading_Type.CHAR_ARRAY:
                    result = DCM_Block_Type.STRING;
                    break;
                case DCM_Block_Reading_Type.STRING_ARRAY:
                case DCM_Block_Reading_Type.TAG_ARRAY:
                    result = DCM_Block_Type.STRING;
            }
        }
        if( result) return result;
        else throw new Error(`No suitable block type could be determined from group: ${group}, element: ${element} and block reading type: ${block_reading_type}!`);
    }  

    public set_data(data : ArrayBuffer) : void {
        if(this.block_byte_length == data.byteLength){
            switch(this.block_type){
                case DCM_Block_Type.NUMBER_ARRAY:
                case DCM_Block_Type.STRING:
                case DCM_Block_Type.STRING_ARRAY:
                case DCM_Block_Type.VECTOR_3:
                    break;
            }
        }
        else throw new Error(`The given ArrayBuffer is not the same byte length as this blocks data.`);
    }

    private set_num_arr(data : ArrayBuffer) : void {
        not_implemented_error();
    }

    private set_str_arr(data : ArrayBuffer) : void {
        not_implemented_error();
    }

}

function not_implemented_error():void{
    throw new Error("This has not been implemented!");
}

function outputline(line : string) : void {
	let demo_element = document.getElementById("demo");
    if(demo_element) demo_element.innerHTML += (line + "<br>");
    else console.error("no element wit the id \"demo\" found!");
}