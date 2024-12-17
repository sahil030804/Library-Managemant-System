const errorCodes = {
  USER_NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: "user_not_found",
      message: "User not found.",
    },
  },
  USER_EXIST: {
    httpStatusCode: 409,
    body: {
      code: "user_already_exist",
      message: "User already exist.",
    },
  },
  INVALID_PASSWORD: {
    httpStatusCode: 401,
    body: {
      code: "invalid_password",
      message: "Invalid password",
    },
  },
  EMAIL_REQUIRED: {
    httpStatusCode: 400,
    body: {
      code: "email_id_required",
      message: "Email ID is required",
    },
  },
  INVALID_EMAIL: {
    httpStatusCode: 400,
    body: {
      code: "email_id_invalid",
      message: "Email ID is in invalid format",
    },
  },
  PASSWORD_REQUIRED: {
    httpStatusCode: 400,
    body: {
      code: "password_required",
      message: "Password is required",
    },
  },
  NAME_REQUIRED: {
    httpStatusCode: 400,
    body: {
      code: "name_required",
      message: "Name is required",
    },
  },
  NAME_NOT_NULL: {
    httpStatusCode: 400,
    body: {
      code: "name_is_null",
      message: "Name can't be null",
    },
  },
  REFRESH_TOKEN_MISSING: {
    httpStatusCode: 401,
    body: {
      code: "refresh_token_unavailable",
      message: "Refresh Token Is Unavailable",
    },
  },
  REFRESH_TOKEN_EXPIRED: {
    httpStatusCode: 401,
    body: {
      code: "refresh_token_expired",
      message: "Refresh token expired or in use",
    },
  },
  ACCESS_TOKEN_MISSING: {
    httpStatusCode: 401,
    body: {
      code: "access_token_unavailable",
      message: "Access Token Is Unavailable",
    },
  },
  ACCESS_TOKEN_EXPIRED: {
    httpStatusCode: 401,
    body: {
      code: "access_token_expired",
      message: "Access token expired",
    },
  },
  TOKEN_INVALID: {
    httpStatusCode: 401,
    body: {
      code: "invalid_token",
      message: "Invalid token",
    },
  },
  ACCESS_DENIED: {
    httpStatusCode: 403,
    body: {
      code: "access_denied",
      message: "Access denied. Please log in",
    },
  },
  USER_UNAUTHORIZED: {
    httpStatusCode: 401,
    body: {
      code: "user_unthorized",
      message: "User is unauthorized",
    },
  },
  CURRENT_PASSWORD: {
    httpStatusCode: 400,
    body: {
      code: "current_password",
      message: "This is your current password",
    },
  },
  BOOK_NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: "book_not_found",
      message: "Book not found",
    },
  },
  BOOK_EXIST: {
    httpStatusCode: 409,
    body: {
      code: "book_already_exist",
      message: "Book already exist",
    },
  },
  BOOK_NOT_DELETE: {
    httpStatusCode: 400,
    body: {
      code: "book_not_deleted",
      message: "error occured in book deleting process",
    },
  },
  INVALID_BOOK_ID: {
    httpStatusCode: 400,
    body: {
      code: "book_id_invalid",
      message: "Book id is invalid",
    },
  },
  EMPTY_BOOK_DB: {
    httpStatusCode: 404,
    body: {
      code: "no_books_in_db",
      message: "No books found in database.",
    },
  },
  PASSWORD_NOT_SAME: {
    httpStatusCode: 400,
    body: {
      code: "password_not_same",
      message: "Password and Confirm password are not same",
    },
  },
  NO_MEMBER_FOUND: {
    httpStatusCode: 404,
    body: {
      code: "no_members_found",
      message: "No members found in database",
    },
  },
  INVALID_MEMBER_ID: {
    httpStatusCode: 400,
    body: {
      code: "member_id_invalid",
      message: "Member id is invalid",
    },
  },
  BOOK_NOT_AVAILABLE: {
    httpStatusCode: 400,
    body: {
      code: "book_is_not_available",
      message: "Book is not available in library",
    },
  },
  BORROW_LIMIT: {
    httpStatusCode: 400,
    body: {
      code: "borrow_limit_reached",
      message: "User books borrowing limit exceed",
    },
  },
  ACCOUNT_INACTIVE: {
    httpStatusCode: 400,
    body: {
      code: "account_inactive",
      message: "Account suspended",
    },
  },
};

export default errorCodes;
