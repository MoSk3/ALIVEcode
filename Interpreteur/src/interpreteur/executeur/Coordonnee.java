package interpreteur.executeur;



public class Coordonnee {
	private String coord;
	private int numLigne;

	public Coordonnee(String coord){
		this.coord = coord;
		this.numLigne = -1;
	}
	
	Coordonnee(String coord, int ligne){
		this.coord = coord;
		this.numLigne = ligne;
	}
	
	public void setCoord(String coord) {
		this.coord = coord;
	}
	
	public void setNumLigne(int numLigne) {
		this.numLigne = numLigne;
	}
	
	/**
     * @return le scope dans lequel se situe la coordonnee
     */
    public String getScope() {
    	return coord.substring(coord.lastIndexOf(">")+1);
    }

    /**
     * @return le bloc le plus recent dans lequel se situe la coordonne
     */
    public String getBlocActuel(){
    	if (coord.indexOf("<", 1) == -1) return getScope();
    	else return coord.substring(coord.indexOf(">")+1, coord.indexOf("<", 1));
    }
    
    

    /**
     * @param nomNouveauBloc <li>nom du bloc qui va remplacer le bloc actuel</li>
     * @return la nouvelle coordonnee avec le bloc remplacer
     */
    public Coordonnee remplacerBlocActuel(String nomNouveauBloc){
        finBloc();
        nouveauBloc(nomNouveauBloc);
        return this;
    }
    
    /**
     * recommence le bloc actuel
     * @return la coordonnee avec le bloc recommencer
     */
    public Coordonnee recommencerLeBlocActuel(){
    	finBloc();
        moinsUn();
        return this;
    }

    /**
     * ajoute un bloc a la coordonnee
     * @param nom <li>nom du nouveau bloc</li>
     * @return la coordonne avec le nouveau bloc
     */
    public Coordonnee nouveauBloc(String nom){
        coord = "<0>" + nom + coord;
        return this;
    }
    
    /**
     * retire le bloc actuel de la coordonnee
     * @return la coordonnee avec le bloc actuel en moins
     */
    public Coordonnee finBloc(){
        coord = coord.replaceFirst("<\\d+>\\w+", "");
        return this;
    }

    /**
     * ajoute un a la coordonnee (dans le bloc actuel)
     * @return la nouvelle coordonnee
     */
    public Coordonnee plusUn(){
        String premierNum = coord.substring(coord.indexOf("<")+1, coord.indexOf(">"));
        int nextNum = Integer.valueOf(premierNum) + 1;
        coord = "<" + nextNum + coord.substring(coord.indexOf(">"));
        return this;
    }
    /**
     * retire un a la coordonnee (dans le bloc actuel)
     * @return la nouvelle coordonnee
     */
    public Coordonnee moinsUn() { 
        String premierNum = coord.substring(coord.indexOf("<")+1, coord.indexOf(">"));
        int nextNum = Integer.valueOf(premierNum) - 1;
        coord = "<" + nextNum + coord.substring(coord.indexOf(">"));
        return this;
    }
    
    public String getCoordAsString() {
		return coord;
	}
    
    public int getLigne() {
		return numLigne;
	}
    
    public Coordonnee copy() {
    	return new Coordonnee(this.coord, this.numLigne);
    }
    
    public Coordonnee copy(int numLigne) {
    	return new Coordonnee(this.coord, numLigne);
    }
    
    @Override
    public String toString() {
    	return "(" + this.getCoordAsString() + ", " + this.numLigne + ")";
    }
    
    @Override
    public boolean equals(Object obj) {
    	return this.toString().equals(obj.toString());
    }
}


























