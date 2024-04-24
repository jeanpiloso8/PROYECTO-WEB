
export interface LoginRequestDto{
    username: string;
    password: string;
}

export interface ResponseDto {
    result: any | null; // 'object' en C# es similar a 'any' en TypeScript, 'null' es para permitir valores nulos
    isSuccess: boolean;
    message: string;
}
