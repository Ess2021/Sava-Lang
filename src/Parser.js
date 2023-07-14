class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  eat(tokenType) {
    // console.log(this.currentToken);
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(`Unexpected token: ${this.currentToken.type}. Expected ${tokenType}.`);
    }
  }

  variableDeclaration() {
    this.eat("SAVA")
    let variableName = this.currentToken.value;
    this.eat("IDENTIFIER");
    this.eat("AS");
    let variableType = this.currentToken.value;
    if (variableType == "number") {
      this.eat("NUMBER_TYPE");
    } else if (variableType == "string") {
      this.eat("STRING_TYPE")
    } else {
      throw new Error(`Unknown data type: ${variableType}`);
    }
    return { type: "VariableDeclaration", variableName, variableType };
  }

  assignmentStatement() {
    let variableName = this.currentToken.value;
    this.eat("IDENTIFIER");
    // this.eat("ASSIGN");
    let value = this.currentToken.value;
    if (this.currentToken.type === "NUMBER") {
      this.eat("NUMBER");
      return { type: "AssignmentStatement", variableName, value: parseInt(value), variableType: "number" };
    } else if (this.currentToken.type === "STRING") {
      this.eat("STRING");
      return { type: "AssignmentStatement", variableName, value, variableType: "string" };
    } else if (this.currentToken.type === "IDENTIFIER") {
      let rVariableName = this.currentToken.value;
      this.eat("IDENTIFIER");
      return { type: "AssignmentStatement", variableName, value, variableType: rVariableName }; // 変数を代入する場合、variableNameはその変数の名前
    } else {
      throw new Error(`Invalid assignment value: ${value}`);
    }
  }

  outputStatement() {
    this.eat("OUTPUT");
    if (this.currentToken.type === "NUMBER") {
      let value = this.currentToken.value;
      this.eat("NUMBER");
      return { type: "OutputStatement", value };
    } else if (this.currentToken.type === "STRING") {
      let value = this.currentToken.value;
      this.eat("STRING");
      return { type: "OutputStatement", value };
    } else {
      let variableName = this.currentToken.value;
      this.eat("IDENTIFIER");
      return { type: "OutputStatement", value: variableName, isVariable: true };
    }
  }

  labelStatement() {
    this.eat("LABEL");
    let labelName = this.currentToken.value;
    this.eat("IDENTIFIER");
    this.eat("COLON");
    return { type: "LabelStatement", labelName };
  }

  gotoStatement() {
    this.eat("GOTO");
    let labelName = this.currentToken.value;
    this.eat("IDENTIFIER");
    return { type: "GotoStatement", labelName };
  }

  ifStatement() {
    this.eat("IF");
    let variableName = this.currentToken.value;
    this.eat("IDENTIFIER");
    let operator = this.currentToken.value;

    if (operator === ">") {
      this.eat("GT");
    } else if (operator === ">=") {
      this.eat("GTE");
    } else if (operator === "<") {
      this.eat("LT");
    } else if (operator === "<=") {
      this.eat("LTE");
    } else if (operator === "=") {
      this.eat("ASSIGN");
    } else {
      throw new Error(`Invalid operator: ${operator}`);
    }

    let value = this.currentToken.value;

    if (this.currentToken.type === "NUMBER") {
      this.eat("NUMBER");
      this.eat("THEN");
      this.eat("GOTO");

      let label = this.currentToken.value;

      this.eat("IDENTIFIER");

      return { type: "IfStatement", variableName, operator, value: parseInt(value), label };
    } else if (this.currentToken.type === "STRING") {
      this.eat("STRING");
      this.eat("THEN");
      this.eat("GOTO");

      let label = this.currentToken.value;

      this.eat("IDENTIFIER");

      return { type: "IfStatement", variableName, operator, value, label };
    } else if (this.currentToken.type === "IDENTIFIER") { // 変数との比較
      this.eat("IDENTIFIER");
      this.eat("THEN");
      this.eat("GOTO");

      let label = this.currentToken.value;

      this.eat("IDENTIFIER");
      return { type: "IfStatement", variableName, operator, value, label, isVariable: true }; // 変数との比較の場合、valueは変数名
    } else {
      throw new Error(`Invalid if condition value: ${value}`);
    }
  }

  incrementStatement() {
    let variableName = this.currentToken.value;

    this.eat("IDENTIFIER");
    // this.eat("INCREMENT");
    return { type: "IncrementStatement", variableName }
  }

  decrementStatement() {
    let variableName = this.currentToken.value;

    this.eat("IDENTIFIER");
    // this.eat("DECREMENT");
    return { type: "DecrementStatement", variableName }
  }

  increaseByStatement() {
    let variableName = this.currentToken.value;
    this.eat("IDENTIFIER");
    // this.eat("INCREASEBY");
    let type = this.currentToken.type;
    let displaceValue;
    if (type === "NUMBER") {
      displaceValue = this.currentToken.value;
      this.eat("NUMBER") // TODO: 文字列の連結
    } else if (type === "STRING") {
      displaceValue = this.currentToken.value;
      this.eat("STRING")
    } else {
      displaceValue = this.currentToken.value; // 右辺が変数の場合は、displaceValueは変数名
      this.eat("IDENTIFIER");
    }

    return { type: "IncreaseByStatement", variableName, displaceValue, variableType: type }
  }

  decreaseByStatement() {
    let variableName = this.currentToken.value;
    this.eat("IDENTIFIER");
    // this.eat("DECREASEBY");
    let type = this.currentToken.type;
    let displaceValue;
    if (type === "NUMBER") {
      displaceValue = this.currentToken.value;
      this.eat("NUMBER") // マイナスは文字列なし
    } else {
      displaceValue = this.currentToken.value; // 右辺が変数の場合は、displaceValueは変数名
      this.eat("IDENTIFIER");
    }

    return { type: "DecreaseByStatement", variableName, displaceValue, variableType: type }
  }

  statement() {
    if (this.currentToken.type === "SAVA") {
      return this.variableDeclaration();
    } else if (this.currentToken.type === "IDENTIFIER") {
      let lookaheadToken = this.lexer.getNextToken();

      if (lookaheadToken.type === "ASSIGN") {
        return this.assignmentStatement();
      } else if (lookaheadToken.type === "OUTPUT") {
        return this.outputStatement();
      } else if (lookaheadToken.type === "INCREMENT") {
        return this.incrementStatement();
      } else if (lookaheadToken.type === "DECREMENT") {
        return this.decrementStatement();
      } else if (lookaheadToken.type === "INCREASEBY") {
        return this.increaseByStatement();
      } else if (lookaheadToken.type === "DECREASEBY") {
        return this.decreaseByStatement();
      } else {
        throw new Error(`Invalid statement: ${lookaheadToken.type}`);
      }
    } else if (this.currentToken.type === "LABEL") {
      return this.labelStatement();
    } else if (this.currentToken.type === "GOTO") {
      return this.gotoStatement();
    } else if (this.currentToken.type === "IF") {
      return this.ifStatement();
    } else if (this.currentToken.type === "OUTPUT") {
      return this.outputStatement();
    } else {
      throw new Error(`Invalid statement: ${this.currentToken.type}`);
    }
  }

  program() {
    let statements = [];
    while (this.currentToken.type !== "EOF") {
      statements.push(this.statement());
    }

    return { type: "Program", statements };
  }

  parse() {
    let ast = this.program();
    return ast;
  }
}
