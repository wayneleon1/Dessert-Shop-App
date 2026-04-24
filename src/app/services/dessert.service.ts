import { Injectable } from '@angular/core';
import { Dessert } from '../models/dessert.model';
import DESSERTS from '../../../data.json';

@Injectable({ providedIn: 'root' })
export class DessertService {
  readonly desserts: Dessert[] = DESSERTS;
}
