class Executor {
    constructor(ast) {
      this.ast = ast;
      this.variables = {};
      this.output = [];
      this.currentIndex = 0;
    }
  
    execute() {
      let currentIndex = 0;
      while (currentIndex < this.ast.statements.length) {
        let statement = this.ast.statements[currentIndex];
        let nextIndex = this.executeStatement(statement);
        if (nextIndex === undefined) {
          currentIndex++;
        } else {
          currentIndex = nextIndex;
        }
  
        this.currentIndex = currentIndex;
        // console.log(this.variables);
      }
      return this.output;
    }
  
    executeStatement(statement) {
      if (statement.type === "VariableDeclaration") {
        this.executeVariableDeclaration(statement);
      } else if (statement.type === "AssignmentStatement") {
        this.executeAssignmentStatement(statement);
      } else if (statement.type === "OutputStatement") {
        this.executeOutputStatement(statement);
      } else if (statement.type === "LabelStatement") {
        // なんもしない
      } else if (statement.type === "GotoStatement") {
        return this.executeGotoStatement(statement);
      } else if (statement.type === "IfStatement") {
        return this.executeIfStatement(statement);
      } else if (statement.type === "IncrementStatement") {
        return this.executeIncrementStatement(statement);
      } else if (statement.type === "DecrementStatement") {
        return this.executeDecrementStatement(statement);
      } else if (statement.type === "IncreaseByStatement") {
        return this.executeIncreaseByStatement(statement);
      } else if (statement.type === "DecreaseByStatement") {
        return this.executeDecreaseByStatement(statement);
      } else {
        throw new Error(`Invalid statement type: ${statement.type}`);
      }
    }
  
    executeVariableDeclaration(statement) {
      let { variableName, variableType } = statement;
      if (variableType === "number") {
        this.variables[variableName] = { value: 0, variableType };
      } else if (variableType === "string") {
        this.variables[variableName] = { value: "", variableType };
      } else {
        throw new Error(`Invalid variable type: ${variableType}`);
      }
    }
  
    executeAssignmentStatement(statement) {
      let { variableName, value, variableType } = statement;
      if (this.variables[variableName] === undefined) {
        throw new Error(`Variable not found: ${variableName}`);
      }
  
      if (!["number", "string"].includes(variableType)) { // 変数の値を代入するとき
        if (this.variables[variableType] === undefined) {
          throw new Error(`Variable not found: ${variableType}`);
        }
  
        if (this.variables[variableName].variableType === this.variables[variableType].variableType) {
          this.variables[variableName] = {
            value: this.variables[variableType].value,
            variableType: this.variables[variableName].variableType
          };
  
          return;
        } else {
          throw new Error(`Unexpected data type: ${this.variables[variableType].variableType}. Expected ${this.variables[variableName].variableType}.`);
        }
      }
  
      if (this.variables[variableName].variableType != variableType) {
        throw new Error(`Unexpected data type: ${variableType}. Expected ${this.variables[variableName].variableType}.`);
      }
  
      this.variables[variableName] = { value, variableType };
    }
  
    executeOutputStatement(statement) {
      let { value, isVariable } = statement;
      if (isVariable) {
        this.output.push(this.variables[value].value);
      } else {
        this.output.push(value)
      }
    }
  
    executeGotoStatement(statement) {
      let { labelName } = statement;
      for (let i = 0; i < this.ast.statements.length; i++) {
        if (this.ast.statements[i].type === "LabelStatement" && this.ast.statements[i].labelName === labelName) {
          return i;
        }
      }
      throw new Error(`Label not found: ${labelName}`);
    }
  
    executeIfStatement(statement) {
      let { variableName, operator, value, isVariable } = statement;
      let variableValue = this.variables[variableName].value;
      let condition;
  
      if (isVariable) {
        if (this.variables[value] === undefined) {
          throw new Error(`Variable not found: ${variableName}`);
        }
  
        value = this.variables[value].value;
      }
  
      if (operator === ">") {
        condition = variableValue > value;
      } else if (operator === ">=") {
        condition = variableValue >= value;
      } else if (operator === "<") {
        condition = variableValue < value;
      } else if (operator === "<=") {
        condition = variableValue <= value;
      } else if (operator === "=") {
        condition = variableValue === value;
      } else {
        throw new Error(`Invalid operator: ${operator}`);
      }
  
      if (!condition) {
        return;
      }
  
      let gotoIndex = -1;
      for (var i = 0; i < this.ast.statements.length; i++) {
        if (
          this.ast.statements[i].type === "LabelStatement" &&
          this.ast.statements[i].labelName === statement.label
        ) {
          gotoIndex = i;
          break;
        }
      }
      if (gotoIndex === -1) {
        throw new Error(`Label not found: ${statement.label}`);
      }
      return gotoIndex;
    }
  
    executeIncrementStatement(statement) {
      let { variableName } = statement;
      if (this.variables[variableName] === undefined) {
        throw new Error(`Variable not found: ${variableName}`);
      }
  
      if (this.variables[variableName].variableType != "number") {
        throw new Error(`${variableName} is not a number.`);
      }
  
      this.variables[variableName] = {
        value: this.variables[variableName].value + 1,
        variableType: this.variables[variableName].variableType
      }
    }
  
    executeDecrementStatement(statement) {
      let { variableName } = statement;
      if (this.variables[variableName] === undefined) {
        throw new Error(`Variable not found: ${variableName}`);
      }
  
      if (this.variables[variableName].variableType != "number") {
        throw new Error(`${variableName} is not a number.`);
      }
  
      this.variables[variableName] = {
        value: this.variables[variableName].value - 1,
        variableType: this.variables[variableName].variableType
      }
    }
  
    executeIncreaseByStatement(statement) {
      let { variableName, displaceValue, variableType } = statement;
      let variable = this.variables[variableName];
  
      if (variable === undefined) {
        throw new Error(`Variable not found: ${variableName}`);
      }
  
      if (variableType === "IDENTIFIER") { // 変数の値を代入するとき
        if (this.variables[displaceValue] === undefined) {
          throw new Error(`Variable not found: ${displaceValue}`);
        }
  
        if (variable.variableType === "string") {
          this.variables[variableName] = {
            value: variable.value + this.variables[displaceValue].value,
            variableType: variable.variableType
          };
  
          return;
        }
  
        if (this.variables[displaceValue].variableType === variable.variableType) {
          this.variables[variableName] = {
            value: variable.value + this.variables[displaceValue].value,
            variableType: variable.variableType
          };
  
          return;
        } else {
          throw new Error(`Unexpected data type: ${this.variables[displaceValue].variableType}. Expected ${variable.variableType}.`);
        }
      }
  
      let vType = "string";
      if (variableType === "number") {
        vType = "number";
  
        if (variable.variableType != vType) { // 文字列 += 数値は可能だからこの位置
          throw new Error(`Unexpected data type: ${vType}. Expected ${variable.variableType}.`);
        }
      }
  
      this.variables[variableName] = {
        value: variable.value + displaceValue,
        variableType: vType
      };
    }
  
    executeDecreaseByStatement(statement) {
      let { variableName, displaceValue, variableType } = statement;
      let variable = this.variables[variableName];
  
      if (variable === undefined) {
        throw new Error(`Variable not found: ${variableName}`);
      }
  
      if (variableType === "IDENTIFIER") { // 変数の値を代入するとき
        if (this.variables[displaceValue] === undefined) {
          throw new Error(`Variable not found: ${displaceValue}`);
        }
  
        if (this.variables[displaceValue].variableType === variable.variableType) {
          this.variables[variableName] = {
            value: variable.value - this.variables[displaceValue].value,
            variableType: variable.variableType
          };
  
          return;
        } else {
          throw new Error(`Unexpected data type: ${this.variables[displaceValue].variableType}. Expected ${variable.variableType}.`);
        }
      }
  
      let vType = "number"
  
      if (variable.variableType != vType) {
        throw new Error(`Unexpected data type: ${vType}. Expected ${variable.variableType}.`);
      }
  
      this.variables[variableName] = {
        value: variable.value - displaceValue,
        variableType: vType
      };
    }
  }
  