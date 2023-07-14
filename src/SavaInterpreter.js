class SavaInterpreter {
    constructor() {
        console.log("Sava-Lang v0 (c) 2023 Ess2021");

        this.lexer = null;
        this.parser = null;
        this.executor  = null;
    }

    run(code) {
        try {
            this.lexer = new Lexer(code);
            this.parser = new Parser(this.lexer);
            this.executor  = new Executor (this.parser.parse());

            let output = this.executor .execute();
            for (var o of output) {
                console.log(o);
            }
        } catch (error) {
            try {
                console.error("Sava-Lang Runtime Error:");
                console.error(`  ${error.message}`);
                console.error(`  at line ${this.executor .currentIndex + 1}`);
            } catch {
                console.error("Sava-Lang Parse Error:")
                console.error(`  ${error.message}`);
            }
        }
    }
}
