
import { GraphQLError } from "graphql";

export function validationError(errors) {
    return new GraphQLError(
      "无法处理请求!",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      { errorFields: errors }
    );
}
