<?php

	class Pair {
		protected $v;
		protected $w;
	
		public function __construct($v, $w) {
			$this->v = $v;
			$this->w = $w;
		}
	
		//accessors
		public function v() { return $this->v; }
		public function w() { return $this->w; }
	
		public function toString() {
			return "(".$this->v.",".$this->w.") ";
		}
	}

	class Triple {
		protected $from;
		protected $tp;
		protected $w; 
	
		public function __construct($f, $t, $w) {
			$this->from = $f;
			$this->to = $t;
			$this->w = $w;
		}
	
		//accessors
		public function from() { return $this->from; }
		public function to() { return $this->to; }
		public function weight() { return $this->w; }
	
		public function toString() {
			return "(".$this->from.",".$this->to.",".$this->w.") ";
		}
	}
  
  class MST{
	protected $adjList;
	protected $edgeList;
	protected $graphTemplate;
    protected $min; // true means the MST is minimum spanning tree

    public function __construct($isMin){
      $this->init();
      $this->min = $isMin;
    }
	
	protected static function pairSort($a, $b) { //a and b are pairs
	  if($a->w() == $b->w()) return ($a->v() - $b->v());
	  else return ($a->w() > $b->w());
	}
	
	protected static function tripleSort($a, $b) { //a and b are triples
	  if($a->weight() == $b->weight()) return ($a->to() - $b->to());
	  else return ($a->weight() > $b->weight());
	}

    public function clearAll(){
      $this->init();
    }

    protected function init(){
	  $this->graphTemplate = GraphTemplate::getGraph(5, true, true);
      $this->generateAdjList($this->graphTemplate); //array of array of Pairs
	  $this->generateEdgeList($this->graphTemplate); //array of triples
    }
	
	protected function generateAdjList($graph) {
		$a = $graph["internalAdjList"];
		$e = $graph["internalEdgeList"];
	  
		for($i=0; $i<count($a); $i++) { //for each vertex
			$temp = array();
			foreach ($a[$i] as $key => $value) {
				if(!is_string($key)) {
					$temp[] = new Pair($key, $e[$value]["weight"]);
				}
			}
			$this->adjList[$i] = $temp;
		}
	  
		/*for($i=0; $i<count($this->adjList); $i++) {
			$str = "";
			for($j=0; $j<count($this->adjList[$i]); $j++) {
				$str .= $this->adjList[$i][$j]->toString();
			}
			$str .= "<br/>";
			echo($str);
		}*/
	}

	protected function generateEdgeList($graph) {
		$e = $graph["internalEdgeList"];
		for($i=0; $i<count($e); $i++) { //for each edge
			$this->edgeList[] = new Triple($e[$i]["vertexA"], $e[$i]["vertexB"], $e[$i]["weight"]);
		}
		/*
		$str = "";
		for($i=0; $i<count($this->edgeList); $i++) {
			$str .= $this->edgeList[$i]->toString();
		}
		$str .= "<br/>";
		echo($str);
		*/
	}

    public function toGraphState(){
	  return createState($this->graphTemplate, true);
    }

    public function createRandomGraph(){

    }

    public function prim($start){
	  $edgeSet = array(); //empty set
      $vertexSet = array(); //empty set
	  $vertexSet[] = $start; //put starting vertex in set
	  
	  $PQ = array(); //array of triples (from, to, weight)
	  $nNeighbours = count($this->adjList[$start]);
	  for($i=0; $i<$nNeighbours; $i++) { //enqueue neighbours
	  	  $neighbourEdge = new Triple($start, $this->adjList[$start][$i]->v(), $this->adjList[$start][$i]->w());
		  $PQ[] = $neighbourEdge;
	  }
	  usort($PQ, array('MST', 'tripleSort')); //by weight
	  
	  while(!empty($PQ)) {
	    $edge = array_shift($PQ); //edge is a (from, to, weight) triple
		$v = $edge->to();
		if(array_search($v, $vertexSet) === false) { //v is not in vertexSet
		  $vertexSet[] = $v; //put it in
		  $edgeSet[] = new Triple($edge->from(), $v, $edge->weight());
		  $nNeighbours = count($this->adjList[$v]);
		  for($i=0; $i<$nNeighbours; $i++) { //and enqueue neighbours
			  $PQ[] = new Triple($v, $this->adjList[$v][$i]->v(), $this->adjList[$v][$i]->w());
		  }
		  usort($PQ, array('MST', 'tripleSort')); //by weight
		}
	  }
	  
	  /*
	  $str = "";
	  for($i=0; $i<count($edgeSet); $i++) {
		$str .=  $edgeSet[$i]->toString();
	  }
	  $str .= "<br/>";*/
	  return $edgeSet;
    }

    public function kruskal(){
		$ufds = new UFDS();
		$edgeQ = $this->edgeList;
		$ufds->insertElements(count($this->adjList),count($this->adjList));
		$edgeSet = array();
		usort($edgeQ, array('MST', 'tripleSort')); //by weight
		
		$length = count($edgeQ);
		for($i=0; $i<$length; $i++) {
			$e = array_shift($edgeQ);
			if(!($ufds->isSameSet($e->from(), $e->to()))) { //if does not form cycle
				$edgeSet[] = $e;
				$ufds->unionSet($e->from(), $e->to());
			}
		}
		
		/*
		$str = "";
	    for($i=0; $i<count($edgeSet); $i++) {
		  $str .=  $edgeSet[$i]->toString();
	    }
	    $str .= "<br/>";
		echo($str);
		*/
		return $edgeSet;
    }
	
  }
?>