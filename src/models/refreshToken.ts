import { DataTypes, UUIDV4 } from "sequelize";
import db from "../datasources/db";

const RefreshToken = db.define(
    "refresh",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: UUIDV4
        },
        user: {
            type: DataTypes.UUID,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true
    }
);

export default RefreshToken;
