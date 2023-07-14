class Executor  {
    constructor(ast) {
        this.ast = ast;
        this.variables = {};
        this.output = "";
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
            throw new Error(`Variable, ${variableName} has not been declared.`);
        }

        if (this.variables[variableName].variableType != variableType) {
            throw new Error(`Unexpected data type: ${variableType}. Expected ${this.variables[variableName].variableType}.`);
        }
        this.variables[variableName] = { value, variableType };
    }

    executeOutputStatement(statement) {
        let { variableName } = statement;
        this.output += this.variables[variableName].value;
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
        let { variableName, operator, value } = statement;
        let variableValue = this.variables[variableName].value;
        let condition;
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
            throw new Error(`Variable, ${variableName} has not been declared.`);
        }

        if (this.variables[variableName].variableType != "number") {
            throw new Error(`${variableName} is not a number.`);
        }

        this.variables[variableName] = { 
            variableName,
            value: this.variables[variableName].value + 1,
            variableType: this.variables[variableName].variableType
        }
    }

    executeDecrementStatement(statement) {
        let { variableName } = statement;
        if (this.variables[variableName] === undefined) {
            throw new Error(`Variable, ${variableName} has not been declared.`);
        }

        if (this.variables[variableName].variableType != "number") {
            throw new Error(`${variableName} is not a number.`);
        }

        this.variables[variableName] = { 
            variableName,
            value: this.variables[variableName].value - 1,
            variableType: this.variables[variableName].variableType
        }
    }
}
