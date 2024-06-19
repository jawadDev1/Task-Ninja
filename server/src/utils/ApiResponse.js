class ApiResponse {
  constructor(success = false, message = "some error occured", data) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}

export   {ApiResponse};
