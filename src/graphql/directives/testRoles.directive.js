const {  SchemaDirectiveVisitor } = require("apollo-server-express");
const { defaultFieldResolver } = require('graphql');
import {hasRole} from "../../helpers/hasRole";
export class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type);
    type._requiredAuthRole = this.args.requires;
  }
  // Visitor methods for nested types like fields and arguments
  // also receive a details object that provides information about
  // the parent and grandparent types.
  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType);
    field._requiredAuthRole = this.args.requires;
  }

  ensureFieldsWrapped(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
    
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function (...args) {
        // Get the required Role from the field first, falling back
        // to the objectType if no Role is required by the field:
        // let [_, {}, { user, isAuth,roles }] = args;
   
        const requiredRole =
          field._requiredAuthRole ||
          objectType._requiredAuthRole;
        if (! requiredRole) {
          return resolve.apply(this, args);
        }
        // console.log(args[2].user,"dyd")
        const context = args[2];
        let user = context.user.roles; 
      
    console.log(args[2],"dge")
       let role = await user.map(b=>b.role)
      let has = role.includes(requiredRole);
    
        if (!has) {
          throw new Error("You are not allow to get this result");
        }
        return resolve.apply(this, args);
      };
    });
  }
}