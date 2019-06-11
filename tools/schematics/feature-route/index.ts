import {
  chain,
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  externalSchematic
} from '@angular-devkit/schematics';
import { getWorkspacePath, readJsonInTree } from '@nrwl/workspace';
import Schema from './schema';
import { strings } from '@angular-devkit/core';
import * as ts from 'typescript';
import {
  insertImport,
  getSourceNodes,
  InsertChange
} from '@nrwl/workspace/src/utils/ast-utils';

function addComponentToRoute(options: NormalizedSchema): Rule {
  return (host: Tree) => {
    const featureRoutingPath = `${
      options.appProjectRoot
    }/src/app/${strings.dasherize(options.feature)}/${strings.dasherize(
      options.feature
    )}-routing.module.ts`;

    // tslint:disable-next-line
    const featureRouting = host.read(featureRoutingPath)!.toString('utf-8');

    const src = ts.createSourceFile(
      `${strings.dasherize(options.feature)}-routing.module.ts`,
      featureRouting,
      ts.ScriptTarget.Latest,
      true
    );

    const route = `{
      path: '',
      pathMatch: 'full',
      component: ${strings.capitalize(options.feature)}ContainerComponent
    }`;

    const nodes = getSourceNodes(src);
    const routeNodes = nodes
      .filter((n: ts.Node) => {
        if (n.kind === ts.SyntaxKind.VariableDeclaration) {
          if (
            n.getChildren().findIndex(c => {
              return (
                c.kind === ts.SyntaxKind.Identifier && c.getText() === 'routes'
              );
            }) !== -1
          ) {
            return true;
          }
        }
        return false;
      })
      .map((n: ts.Node) => {
        const arrNodes = n
          .getChildren()
          .filter(c => c.kind === ts.SyntaxKind.ArrayLiteralExpression);
        return arrNodes[arrNodes.length - 1];
      });

    if (routeNodes.length === 1) {
      const navigation: ts.ArrayLiteralExpression = routeNodes[0] as ts.ArrayLiteralExpression;
      const pos = navigation.getStart() + 1;
      const fullText = navigation.getFullText();
      let toInsert = '';
      if (navigation.elements.length > 0) {
        if (fullText.match(/\r\n/)) {
          toInsert = `${fullText.match(/\r\n(\r?)\s*/)[0]}${route},`;
        } else {
          toInsert = `${route},`;
        }
      } else {
        toInsert = `${route}`;
      }

      const recorder = host.beginUpdate(featureRoutingPath);
      recorder.insertRight(pos, toInsert);

      const componentChange = insertImport(
        src,
        featureRoutingPath,
        `${strings.capitalize(options.feature)}ContainerComponent`,
        `./${strings.dasherize(options.feature)}-container/${strings.dasherize(
          options.feature
        )}-container.component`,
        false
      );
      if (componentChange instanceof InsertChange) {
        recorder.insertLeft(
          (componentChange as InsertChange).pos,
          (componentChange as InsertChange).toAdd
        );
      }

      host.commitUpdate(recorder);
      return host;
    }
  };
}

function addRouteToApp(options: NormalizedSchema): Rule {
  return (host: Tree) => {
    const appRoutingPath = `${
      options.appProjectRoot
    }/src/app/app-routing.module.ts`;

    // tslint:disable-next-line
    const appRouting = host.read(appRoutingPath)!.toString('utf-8');

    const src = ts.createSourceFile(
      'app-routing.module.ts',
      appRouting,
      ts.ScriptTarget.Latest,
      true
    );

    const route = `{
      path: '${options.feature}',
      loadChildren: './${strings.dasherize(
        options.feature
      )}/${strings.dasherize(options.feature)}.module#${strings.capitalize(
      options.feature
    )}Module'${
      options.dummy
        ? `,
      canLoad: [DummyGuard]`
        : ''
    }
    }`;

    const nodes = getSourceNodes(src);
    const routeNodes = nodes
      .filter((n: ts.Node) => {
        if (n.kind === ts.SyntaxKind.VariableDeclaration) {
          if (
            n.getChildren().findIndex(c => {
              return (
                c.kind === ts.SyntaxKind.Identifier && c.getText() === 'routes'
              );
            }) !== -1
          ) {
            return true;
          }
        }
        return false;
      })
      .map((n: ts.Node) => {
        const arrNodes = n
          .getChildren()
          .filter(c => c.kind === ts.SyntaxKind.ArrayLiteralExpression);
        return arrNodes[arrNodes.length - 1];
      });

    if (routeNodes.length === 1) {
      const navigation: ts.ArrayLiteralExpression = routeNodes[0] as ts.ArrayLiteralExpression;
      const pos = navigation.getStart() + 1;
      const fullText = navigation.getFullText();
      let toInsert = '';
      if (navigation.elements.length > 0) {
        if (fullText.match(/\r\n/)) {
          toInsert = `${fullText.match(/\r\n(\r?)\s*/)[0]}${route},`;
        } else {
          toInsert = `${route},`;
        }
      } else {
        toInsert = `${route}`;
      }

      const recorder = host.beginUpdate(appRoutingPath);
      recorder.insertRight(pos, toInsert);

      if (options.dummy) {
        const dummyChange = insertImport(
          src,
          `${options.appProjectRoot}/src/app/app-routing.module.ts`,
          'DummyGuard',
          '@martzcodes/core',
          false
        );
        if (dummyChange instanceof InsertChange) {
          recorder.insertLeft(
            (dummyChange as InsertChange).pos,
            (dummyChange as InsertChange).toAdd
          );
        }
      }

      host.commitUpdate(recorder);

      return host;
    }
  };
}

function addNavigation(options: NormalizedSchema): Rule {
  return (host: Tree) => {
    if (!options.navigation) {
      return host;
    }
    const componentPath = `${options.appProjectRoot}/src/app/app.component.ts`;
    const navPath = `{name: '${strings.capitalize(
      options.feature
    )}', router: '/${options.feature}', unsecure: ${
      options.dummy ? 'false' : 'true'
    }}`;
    // tslint:disable-next-line
    const appComponent = host.read(componentPath)!.toString('utf-8');

    const src = ts.createSourceFile(
      'app.component.ts',
      appComponent,
      ts.ScriptTarget.Latest,
      true
    );

    const nodes = getSourceNodes(src);
    const navNodes = nodes
      .filter((n: ts.Node) => {
        if (n.kind === ts.SyntaxKind.BinaryExpression) {
          if (
            n.getChildren().findIndex(c => {
              return (
                c.kind === ts.SyntaxKind.PropertyAccessExpression &&
                c.getText() === 'this.navigation'
              );
            }) !== -1
          ) {
            return true;
          }
        }
        return false;
      })
      .map((n: ts.Node) => {
        const arrNodes = n
          .getChildren()
          .filter(c => (c.kind = ts.SyntaxKind.ArrayLiteralExpression));
        return arrNodes[arrNodes.length - 1];
      });

    if (navNodes.length === 1) {
      const navigation: ts.ArrayLiteralExpression = navNodes[0] as ts.ArrayLiteralExpression;
      const pos = navigation.getEnd() - 1;
      const fullText = navigation.getFullText();
      let toInsert = '';
      if (navigation.elements.length > 0) {
        if (fullText.match(/\r\n/)) {
          toInsert = `,${fullText.match(/\r\n(\r?)\s*/)[0]}${navPath}`;
        } else {
          toInsert = `, ${navPath}`;
        }
      } else {
        toInsert = `${navPath}`;
      }

      const recorder = host.beginUpdate(componentPath);
      recorder.insertLeft(pos, toInsert);
      host.commitUpdate(recorder);
    }

    return host;
  };
}

function showTree(node: ts.Node, indent: string = '    '): void {
  console.log(indent + ts.SyntaxKind[node.kind]);

  if (node.getChildCount() === 0) {
    console.log(indent + '    Text: ' + node.getText());
  }

  for (const child of node.getChildren()) {
    showTree(child, indent + '    ');
  }
}

interface NormalizedSchema extends Schema {
  appProjectRoot: string;
}

function normalizeOptions(host: Tree, options: Schema): NormalizedSchema {
  const appProjectRoot = `apps/${options.project}`;

  return {
    ...options,
    appProjectRoot
  };
}

export default function(schema: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const options = normalizeOptions(host, schema);

    const angularJson = readJsonInTree(host, getWorkspacePath(host));
    if (!angularJson.projects[options.project]) {
      throw new SchematicsException(
        `Project ${options.project} is not in angular.json file!`
      );
    }
    return chain([
      externalSchematic('@schematics/angular', 'module', {
        project: options.project,
        name: `${options.feature}`,
        routing: true
      }),
      externalSchematic('@schematics/angular', 'component', {
        project: options.project,
        name: `${options.feature}/${options.feature}-container`,
        changeDetection: 'OnPush'
      }),
      addComponentToRoute(options),
      addRouteToApp(options),
      addNavigation(options)
    ]);
  };
}
