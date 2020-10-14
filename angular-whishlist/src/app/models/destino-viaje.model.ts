import { ObjectUnsubscribedError } from 'rxjs';
import {v4 as uuid} from 'uuid';

export class DestinoViaje {
	private selected: boolean;
	public servicios: string[];
	id = uuid();
	
	constructor(public nombre: string, public imagenUrl: string, public votes: number = 0){
		this.servicios=['pileta','desayuno'];
	 }

	setSelected(s: boolean) {
		this.selected = s;
	}

	isSelected() {
		return this.selected;
	}

	voteUp(): any {
		this.votes++;
	}

	voteDown(): any {
		this.votes--;
	}	

	refresh(): any {
	  this.votes = 0;
	}
}