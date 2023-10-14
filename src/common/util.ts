"use strict";

import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";

// Borrowed from https://github.com/golang/vscode-go

/**
 * Expands ~ to homedir in non-Windows platform
 */
export function resolveHomeDir(inputPath: string): string {
    if (!inputPath || !inputPath.trim()) {
        return inputPath;
    }
    return inputPath.startsWith('~') ? path.join(os.homedir(), inputPath.substr(1)) : inputPath;
}

export function getWorkspaceFolderPath(fileUri?: vscode.Uri): string | undefined {
    if (fileUri) {
        const workspace = vscode.workspace.getWorkspaceFolder(fileUri);
        if (workspace) {
            return workspace.uri.fsPath;
        }
    }

    // fall back to the first workspace
    const folders = vscode.workspace.workspaceFolders;
    if (folders && folders.length) {
        return folders[0].uri.fsPath;
    }
    return undefined;
}

/**
 * Expands ~ to homedir in non-Windows platform and resolves
 * ${workspaceFolder}, ${workspaceRoot} and ${workspaceFolderBasename}
 */
export function resolvePath(inputPath: string, workspaceFolder?: string): string {
    if (!inputPath || !inputPath.trim()) {
        return inputPath;
    }

    if (!workspaceFolder && vscode.workspace.workspaceFolders) {
        workspaceFolder = getWorkspaceFolderPath(
            vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri
        );
    }

    if (workspaceFolder) {
        inputPath = inputPath.replace(/\${workspaceFolder}|\${workspaceRoot}/g, workspaceFolder);
        inputPath = inputPath.replace(/\${workspaceFolderBasename}/g, path.basename(workspaceFolder));
    }
    return resolveHomeDir(inputPath);
}
