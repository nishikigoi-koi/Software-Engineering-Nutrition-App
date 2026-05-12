class CustomerError extends Error {
    statusCode: number;

    constructor(message: string = "Internal Server Error", statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default CustomerError;