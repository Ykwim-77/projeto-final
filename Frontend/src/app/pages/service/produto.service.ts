import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
    private apiUrl: string = 'http://localhost:3000/produto';
    private http = inject(HttpClient);
    

}