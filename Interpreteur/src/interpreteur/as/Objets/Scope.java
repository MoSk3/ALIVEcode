package interpreteur.as.Objets;

import interpreteur.executeur.Executeur;

import java.util.Stack;

public class Scope {
    // static fields
    private final static Stack<Scope> scopeStack = new Stack<>();
    private final static Stack<ScopeInstance> scopeInstanceStack = new Stack<>();

    // non static fields
    private ScopeInstance parent;
    private final Stack<ASObjet.Variable> variablesDeclarees = new Stack<>();

    public Scope() {
        this.parent = null;
    }

    public Scope(Scope fromScope) {
        this.parent = null;
        this.variablesDeclarees.addAll(fromScope.cloneVariablesDeclarees());
    }

    public Scope(ScopeInstance parent) {
        this.parent = parent;
    }

    public void setParent(ScopeInstance parent) {
        this.parent = parent;
    }

    //#region --------- static stuff ---------

    /**
     * Crée un nouveau scope puis le met comme <code>currentScope</code>
     *
     * @return the new scope
     */
    public static Scope makeNewCurrentScope() {
        Scope scope = new Scope();
        updateCurrentScope(scope);
        return scope;
    }

    public static Stack<Scope> getScopeStack() {
        return scopeStack;
    }

    public static Scope getCurrentScope() {
        return scopeStack.peek();
    }

    public static void updateCurrentScope(Scope scope) {
        scopeStack.push(scope);
    }

    public static void popCurrentScope() {
        scopeStack.pop();
    }


    public static Stack<ScopeInstance> getScopeInstanceStack() {
        return scopeInstanceStack;
    }

    public static ScopeInstance getCurrentScopeInstance() {
        return scopeInstanceStack.peek();
    }

    public static void pushCurrentScopeInstance(ScopeInstance scopeInstance) {
        scopeInstanceStack.push(scopeInstance);
    }

    public static void popCurrentScopeInstance() {
        scopeInstanceStack.pop();
    }


    public static void resetAllScope() {
        //Executeur.printCompiledCode(scopeStack.toString());
        //Executeur.printCompiledCode(scopeInstanceStack.toString());
        scopeInstanceStack.clear();
        scopeStack.clear();
    }

    //#endregion


    //#region --------- not static stuff ---------

    private Stack<ASObjet.Variable> cloneVariablesDeclarees() {
        Stack<ASObjet.Variable> newVariableStack = new Stack<>();
        variablesDeclarees.forEach(var -> newVariableStack.push(var.clone()));
        return newVariableStack;
    }

    public Stack<ASObjet.Variable> getVariablesDeclarees() {
        return variablesDeclarees;
    }

    public ScopeInstance makeScopeInstance(ScopeInstance parent) {
        return new ScopeInstance(parent, cloneVariablesDeclarees());
    }

    public ScopeInstance makeScopeInstanceFromCurrentScope() {
        return new ScopeInstance(getCurrentScopeInstance(), cloneVariablesDeclarees());
    }

    public ScopeInstance makeScopeInstanceFromScopeParent() {
        return new ScopeInstance(parent, cloneVariablesDeclarees());
    }

    /**
     * Cette fonction devrait être appelée <b>SEULEMENT</b> au compile time
     *
     * @param variable la variable qui est déclarée
     */
    public void declarerVariable(ASObjet.Variable variable) {
        variablesDeclarees.push(variable);
    }

    public ASObjet.Variable getVariable(String nom) {
        return variablesDeclarees.stream()
                .filter(var -> var.obtenirNom().equals(nom))
                .findFirst()
                .orElse(null);
    }

    @Override
    public String toString() {
        return "Scope{" +
                "variablesDeclarees=" + variablesDeclarees +
                '}';
    }

    //#endregion


    //#region --------- ScopeInstance ---------

    public static class ScopeInstance {
        private final ScopeInstance parent;
        private final Stack<ASObjet.Variable> variableStack;

        private ScopeInstance(ScopeInstance parent, Stack<ASObjet.Variable> variableStack) {
            this.parent = parent;
            this.variableStack = variableStack;
        }

        public ScopeInstance getParent() {
            return parent;
        }

        public Stack<ASObjet.Variable> getVariableStack() {
            return variableStack;
        }

        public ASObjet.Variable getVariable(String nom) {
            return variableStack.stream()
                    .filter(var -> var.obtenirNom().equals(nom))
                    .findFirst()
                    .orElse(parent == null ? null : parent.getVariable(nom));
        }

        @Override
        public String toString() {
            return "ScopeInstance{" +
                    "variableStack=" + variableStack +
                    ", parent=" + parent +
                    '}';
        }
    }

    //#endregion

}

























