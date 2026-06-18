import * as ts from 'typescript';

const sourceFile = ts.readSourceFile('cyberPenetration.ts', ts.ScriptTarget.Latest, undefined, ts.ScriptKind.TS);

function visit(node, depth = 0) {
    const pos = node.getPosition();
    console.log(`${' '.repeat(depth)}${ts.SyntaxKind[node.kind]} [${pos}]`);
    node.forEachChild(child => visit(child, depth + 2));
}

visit(sourceFile);
