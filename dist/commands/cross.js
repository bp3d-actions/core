"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cross = void 0;
const os = __importStar(require("os"));
const io = __importStar(require("@actions/io"));
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const cargo_1 = require("./cargo");
class Cross {
    constructor(path) {
        this.path = path;
    }
    static async getOrInstall() {
        try {
            return await Cross.get();
        }
        catch (error) {
            core.debug(`${error}`);
            return await Cross.install();
        }
    }
    static async get() {
        const path = await io.which('cross', true);
        return new Cross(path);
    }
    static async install(version) {
        const cargo = await cargo_1.Cargo.get();
        const cwd = process.cwd();
        process.chdir(os.tmpdir());
        try {
            const crossPath = await cargo.installCached('cross', version);
            return new Cross(crossPath);
        }
        finally {
            process.chdir(cwd);
            core.endGroup();
        }
    }
    async call(args, options) {
        if (!options)
            options = {};
        if (!options.env) {
            options.env = {};
            for (const e in process.env)
                options.env[e] = process.env[e];
        }
        options.env['CARGO_TERM_COLOR'] = 'never';
        return await exec.exec(this.path, args, options);
    }
}
exports.Cross = Cross;
//# sourceMappingURL=cross.js.map