import User from "./user";
import RefreshToken from "./refreshToken";

RefreshToken.belongsTo(User, {
    foreignKey: "user",
    as: "userId"
});

export { User, RefreshToken };
