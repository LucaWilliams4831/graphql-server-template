import { DocumentNode, GraphQLSchema, ASTNode } from 'graphql';
import { GraphQLResolverMap, GraphQLSchemaModule } from './resolverMap';
export declare function isNode(maybeNode: any): maybeNode is ASTNode;
export declare function isDocumentNode(node: ASTNode): node is DocumentNode;
export declare function modulesFromSDL(modulesOrSDL: (GraphQLSchemaModule | DocumentNode)[] | DocumentNode): GraphQLSchemaModule[];
export declare function addResolversToSchema(schema: GraphQLSchema, resolvers: GraphQLResolverMap<any>): void;
export declare function buildSchemaFromSDL(modulesOrSDL: (GraphQLSchemaModule | DocumentNode)[] | DocumentNode, schemaToExtend?: GraphQLSchema): GraphQLSchema;
//# sourceMappingURL=buildSchemaFromSDL.d.ts.map