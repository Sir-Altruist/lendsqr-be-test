import { DataTypes, UUIDV4 } from "sequelize";
import db from "../datasources/db";
import bcrypt from "bcryptjs";
import { UserModel, UserPayload } from "../interfaces";
import { Logger } from "../libs";

const User = db.define<UserModel, UserPayload>(
    "user",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "email"
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

// Hash password before registration
User.beforeCreate(async (user) => {
    try {
        const hash = await bcrypt.hash(user.password, 12);
        user.password = hash;
    } catch (err) {
        Logger.info(err.message);
        throw new Error("Server Error: Something went wrong");
    }
});

export default User;
