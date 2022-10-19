export declare const getColor: (type: string) => string;
export declare class ParamPoint {
    protected uid: string;
    instance: SVGElement;
    inside: SVGAElement;
    type: string;
    color: string;
    constructor(options: any);
    init(): void;
    update(): void;
    connect(): void;
    disConnect(): void;
}
