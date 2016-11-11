/**
 * 异步执行eslint，不会阻塞webpack编译
 */
import {CLIEngine} from 'eslint'
import path from 'path'

export default class EslintPlugin {
    constructor(options){
        this.options = Object.assign(
            {
                format: 'stylish'
            },
            options
        );
        this.engins = new CLIEngine(this.options);
    }
    apply(compiler){
        compiler.plugin('done', stats => {
            const files = stats.compilation.fileDependencies.filter(item => !~item.indexOf('node_modules') && ~['.js', '.jsx'].indexOf(path.parse(item).ext));            
            const results = CLIEngine.getErrorResults(this.engins.executeOnFiles(files).results);
            this.printResults(results)
        })
    }
    printResults(results){
        let formatter;
        try{
            formatter = typeof this.options.format !== 'function' ? (this.engins.getFormatter(this.options.format)) : this.options.format
        } catch(e) {
            console.log(e.message);
            return false;
        }
        console.log(formatter(results))
        return false;
    }
}
