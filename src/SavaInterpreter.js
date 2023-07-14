class SavaInterpreter {
    constructor() {
        console.log("Sava-Lang v0 (c) 2023 Ess2021");

        this.lexer = null;
        this.parser = null;
        this.executer = null;
    }

    run(code) {
        try {
            this.lexer = new Lexer(code);
            this.parser = new Parser(this.lexer);
            this.executer = new Executer(this.parser.parse());

            let output = this.executer.execute();
            for (var o of output) {
                console.log(o);
            }
        } catch (error) {
            try {
                console.error("Sava-Lang Runtime Error:");
                console.error(`  ${error.message}`);
                console.error(`  at line ${this.executer.currentIndex + 1}`);
            } catch {
                console.error("Sava-Lang Parse Error:")
                console.error(`  ${error.message}`);
            }
        }
    }
}
