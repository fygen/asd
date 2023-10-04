const fs = require("fs");
const { get } = require("http");
var args = process.argv.slice(2);

const folderName = (directoryPath) => directoryPath.replace(/\//g, "").replace(/\./g, "").replace(/\\/g, "");
const fileName = (file) => file.split(".")[0];
const fromName = (file) => `./${file}`;
const impTemplate = (file) => `import ${fileName(file)} from '${fromName(file)}';\n`;
const reqTemplate = (file) => `export const ${fileName(file)} = require('./${file}')\n`;
const getFiles = (directoryPath) => fs.readdirSync(directoryPath);


const getMethods = (args) => {
    const methodOf = args;
    console.log("get methods of: ", methodOf);

    var methods = Object.getOwnPropertyNames(methodOf);
    console.log(methods);
}

const getFileNames = (args) => {
    fs.opendirSync(args);
    const files = fs.readdirSync(args);
    console.log(__dirname, files);
}

// const fileNamesToJsonFile = (args) => {
//     const files = fs.readdirSync(args);
//     console.log(jsonPath.path, files);
//     fs.writeFileSync(jsonPath.path, files);
// }

const fileNamesToJsonFile = (directoryPath) => {
    directoryPath = directoryPath.replace(/\\/g, '\/');
    const files = fs.readdirSync(directoryPath); // Read the contents of the directory
    const jsonData = {
        path: directoryPath.replace(/\\/g, '\/').replace(".", ""),
        files: files.filter((value) => !value.includes("json")),
    };
    const jsonContent = JSON.stringify(jsonData, null, 2); // Convert to JSON with 2-space indentation

    // Use the directory path to determine the output JSON file path
    const outputFilePath = `${directoryPath}/${directoryPath.replace(/\//g, "").replace(/\./g, "")}.json`;

    fs.writeFileSync(outputFilePath, jsonContent); // Write the JSON data to a file in the same directory
};



const filesToImportFile = (directoryPath) => {
    const files = getFiles(directoryPath);

    let toJS = "";

    files.map((file) => toJS += impTemplate(file)),
        toJS += "\nexport {\n",
        files.map((file) => toJS += `\t${fileName(file)},\n`),
        toJS += "};"

    const outputFilePath = `${directoryPath}/${folderName(directoryPath)}.js`;
    // console.log(toJS);
    fs.writeFileSync(outputFilePath, toJS);
}

const filesToRequireFile = (directoryPath) => {
    const files = getFiles(directoryPath);

    let toJS = "";

    files.map((file) => toJS += reqTemplate(file));
    // console.log(toJS);
    const outputFilePath = `${directoryPath}/${folderName(directoryPath)}.js`;
    fs.writeFileSync(outputFilePath, toJS);
}

console.log(args);
switch (args[0]) {
    case "gm": getMethods(args[1]); break;
    case "gf": getFileNames(args[1]); break;
    case "fj": fileNamesToJsonFile(args[1]); break;
    case "fi": filesToImportFile(args[1]); break;
    case "fr": filesToRequireFile(args[1]); break;
    default: null; break;
}