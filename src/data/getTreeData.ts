function removeUselessBranches(datum, masses, precision) {
  if (datum.children) {
    for (const child of datum.children) {
      const shouldRemove = removeUselessBranches(child, masses, precision);
      if (shouldRemove) {
        datum.children = datum.children.filter((c) => c !== child);
      }
    }
  }
  if (datum?.children.length === 0) {
    if (datum.massMatched) {
      return false;
    } else {
      return true;
    }
  }
}
export function getData(reactionTree, options) {
  const { masses = [], precision = 5 } = options;
  const data = convertReactionsToData(reactionTree, masses, precision);
  for (const datum of data) {
    removeUselessBranches(datum, masses, precision);
  }
  return data;
}

function convertReactionsToData(reactions, masses, precision) {
  const results: any[] = [];
  const reactantIdCode = {};
  for (const reaction of reactions) {
    let result;
    if (reactantIdCode[reaction.reactant.idCode]) {
      result = reactantIdCode[reaction.reactant.idCode];
    } else {
      result = {
        idCode: reaction.reactant.idCode,
        children: [],
        mz: reaction.reactant.mz,
      };
      results.push(result);
      reactantIdCode[reaction.reactant.idCode] = result;
    }
    if (reaction.products) {
      for (const product of reaction.products) {
        result.children.push({
          idCode: product.idCode,
          reaction: reaction.reaction,
          mz: product.mz,
          children: getChildren(product, masses, precision),
          massMatched: isInRange(masses, product.mz, precision),
        });
      }
    }
  }
  return results;
}

function getChildren(reactionProducts, masses, precision) {
  if (!reactionProducts?.children?.length) {
    return [];
  }
  const children: any = [];
  for (const reactionProduct of reactionProducts.children) {
    for (const product of reactionProduct.products) {
      children.push({
        idCode: product.idCode,
        reaction: reactionProduct.reaction,
        mz: product.mz,
        children: getChildren(product, masses, precision),
        massMatched: isInRange(masses, product.mz, precision),
      });
    }
  }
  return children;
}
function isInRange(masses: number[], mass: number, precision: number): boolean {
  if (!mass || !masses) {
    return false;
  }
  const massAccuracy = (precision * mass) / 1e6;

  for (const value of masses) {
    if (Math.abs(value - mass) <= massAccuracy) {
      return true;
    }
  }
  return false;
}
