'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  class Quotation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Quotation.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      Quotation.hasMany(models.Item, {
        foreignKey: 'quotation_id',
        as: 'items',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }

    /**
     * Get quotation data in a clean format
     */
    toJSON() {
      const values = { ...this.get() };
      return values;
    }
  }

  Quotation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      quotation_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Quotation date is required',
          },
        },
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Customer ID is required',
          },
        },
      },
      last_shared_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pdf_path: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'S3 path to the generated PDF file',
      },
    },
    {
      sequelize,
      modelName: 'Quotation',
      tableName: 'quotations',
      indexes: [
        {
          fields: ['customer_id'],
        },
        {
          fields: ['quotation_date'],
        },
      ],
    }
  );

  return Quotation;
};
