import { GraphQLFieldConfig, GraphQLUnionType, GraphQLObjectType, GraphQLScalarType, GraphQLType, GraphQLNamedType } from 'graphql';
export declare type Maybe<T> = null | undefined | T;
export declare const EntityType: GraphQLUnionType;
export declare const ServiceType: GraphQLObjectType<any, any>;
export declare const AnyType: GraphQLScalarType<unknown, unknown>;
export declare const entitiesField: GraphQLFieldConfig<any, any>;
export declare const serviceField: GraphQLFieldConfig<any, any>;
export declare const federationTypes: GraphQLNamedType[];
export declare function isFederationType(type: GraphQLType): boolean;
//# sourceMappingURL=types.d.ts.map