class Lexer {
  constructor(code) {
    this.code = code;
    this.position = 0;
    this.currentChar = this.code[this.position];
  }

  advance() {
    this.position++;
    this.currentChar = this.code[this.position];
  }

  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  getNextToken() {
    while (this.currentChar !== undefined) {
      if (/\s/.test(this.currentChar)) {
        this.advance();
        continue;
      }

      if (this.currentChar === "#") {
        while (this.currentChar !== "\n" && this.currentChar !== undefined) {
          this.advance();
        }
        continue;
      }

      if (this.currentChar === "!") {
        let label = this.currentChar;
        this.advance();
        return new Token("LABEL", label);
      }

      if (this.currentChar === "<") {
        this.advance();
        if (this.currentChar === "<") {
          this.advance();
          return new Token("OUTPUT", "<<");
        }
        if (this.currentChar === "=") {
          this.advance();
          return new Token("LTE", "<=");
        }
        return new Token("LT", "<");
      }

      if (this.currentChar === ">") {
        this.advance();
        if (this.currentChar === "=") {
          this.advance();
          return new Token("GTE", ">=");
        }
        return new Token("GT", ">");
      }

      if (this.currentChar === ":") {
        this.advance();
        if (this.currentChar === "=") {
          this.advance();
          return new Token("ASSIGN", ":=");
        }
        return new Token("COLON", ":");
      }

      if (this.currentChar === "=") {
        this.advance();
        return new Token("ASSIGN", "=");
      }

      if (this.currentChar === "+") {
        this.advance();
        if (this.currentChar === "+") {
          this.advance();
          return new Token("INCREMENT", "++");
        } else if (this.currentChar === "=") {
          this.advance();
          return new Token("INCREASEBY", "+=");
        }
        return new Token("PLUS", "+");
      }

      if (this.currentChar === "-") {
        this.advance();
        if (this.currentChar === "-") {
          this.advance();
          return new Token("DECREMENT", "--");
        } else if (this.currentChar === "=") {
          this.advance();
          return new Token("DECREASEBY", "-=");
        }
        return new Token("MINUS", "-");
      }

      if (/[a-zA-Z]/.test(this.currentChar)) {
        let identifier = "";
        while (this.isLetter(this.currentChar) || this.isDigit(this.currentChar)) {
          identifier += this.currentChar;
          this.advance();
        }
        if (identifier === "sava") {
          return new Token("SAVA", identifier);
        }
        if (identifier === "as") {
          return new Token("AS", identifier);
        }
        if (identifier === "number") {
          return new Token("NUMBER_TYPE", identifier);
        }
        if (identifier === "string") {
          return new Token("STRING_TYPE", identifier);
        }
        if (identifier === "goto") {
          return new Token("GOTO", identifier);
        }
        if (identifier === "if") {
          return new Token("IF", identifier);
        }
        if (identifier === "then") {
          return new Token("THEN", identifier);
        }
        return new Token("IDENTIFIER", identifier);
      }

      if (this.isDigit(this.currentChar)) {
        let number = "";
        while (this.isDigit(this.currentChar)) {
          number += this.currentChar;
          this.advance();
        }
        return new Token("NUMBER", parseInt(number));
      }

      if (this.currentChar === '"') {
        let string = "";
        this.advance();
        while (this.currentChar !== '"' && this.currentChar !== undefined) {
          string += this.currentChar;
          this.advance();
        }
        this.advance(); // skip the closing double quote
        return new Token("STRING", string);
      }

      throw new Error(`Invalid character: ${this.currentChar}`);
    }

    return new Token("EOF", null);
  }
}
