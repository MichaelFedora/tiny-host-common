export interface FileInfo {
    name: string;
    size: number;
    modified: number;
    type?: string;
}
export interface FileList {
    entries: string[];
    page?: number;
}
export interface FileListAdvance {
    entries: {
        [path: string]: FileInfo;
    };
    page?: number;
}
export interface TinyFileDB {
    getFileInfo(path: string): Promise<FileInfo>;
    setFileInfo(path: string, data: FileInfo): Promise<void>;
    delFileInfo(path: string): Promise<void>;
    delFileInfoRecurse(path: string): Promise<void>;
    listFiles(path: string, page?: number): Promise<FileList>;
    listFilesAdvance(path: string, page?: number): Promise<FileListAdvance>;
}
