import { Component, OnInit, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';


@Pipe({
  name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
constructor(private sanitizer: DomSanitizer){}

transform(value: any, args: any): any {
  if (!args) {
    return value;
  }
  // Match in a case insensitive maneer
  const re = new RegExp(args, 'gi');
  const match = value.match(re);

  // If there's no match, just return the original value.
  if (!match) {
    return value;
  }

  const replacedValue = value.replace(re, "<mark>" + match[0] + "</mark>")
  return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
}
}


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FaqComponent implements OnInit {

  public url = 'assets/json/quesAns.json' 
  public selectedCat = 'All';
  public questionAnswers:any = [];

  public categories: string[] = [];
  public allquestionAnswers: any;
  public parentCategories:any;
  public selectedParentCat='';
  public showCatagories= false;
  public showGlobalsearch = false;
  public searchTerm: any;
  public pageTitle: any;

  constructor(private httpClient: HttpClient, private router: Router){}

  ngOnInit(){
    this.showCatagories = false;   
    this.showGlobalsearch = false;
    this.parentCategories  = [];
    this.getQA().subscribe((res:any) => {
      this.allquestionAnswers = this.questionAnswers = res.data;
      this.pageTitle = res.meta.pageTitle;
      for (let entry of this.questionAnswers) {
        if(this.parentCategories.filter((i: { cat: any; }) => i.cat === entry.parentcat).length===0){
          let pc = { "cat": entry.parentcat, "tag": entry.parentcatTag };
          this.parentCategories.push(pc);
        }
      }
      
      console.log(this.parentCategories);
    });
  }

  getAllQuestions(){
    this.selectedCat = 'All';
    this.getQA().subscribe((res:any) => {
      this.questionAnswers = res.data;
      this.questionAnswers = this.allquestionAnswers.filter( (i: { parentcat: any; }) => i.parentcat === this.selectedParentCat);
    });
  }

  getSpecficCategoryQuestions(cat:any){
    this.selectedCat = cat;
    this.questionAnswers = this.allquestionAnswers.filter( (i: { cat: any; parentcat: any; }) => (i.cat === cat && i.parentcat === this.selectedParentCat));
  }



  public getQA(){   
    return this.httpClient.get(this.url);
  }

  public search(searchKey: any){
    this.searchTerm = searchKey;
    this.selectedCat = 'All';
    this.questionAnswers = this.allquestionAnswers.filter( (i: { parentcat: any; question:any; answer:any }) => (i.parentcat === this.selectedParentCat && (i.question.toUpperCase().indexOf(searchKey.toUpperCase())!==-1 || i.answer.toUpperCase().indexOf(searchKey.toUpperCase())!==-1)));
  }
  public globalsearch(searchKey: any){
    this.questionAnswers =[];    
    this.showGlobalsearch = false;
    this.searchTerm = searchKey;
    if(searchKey !== ''){
      this.showGlobalsearch = true;
      this.questionAnswers = this.allquestionAnswers.filter( (i: { question:any; answer:any }) => ((i.question.toUpperCase().indexOf(searchKey.toUpperCase())!==-1 || i.answer.toUpperCase().indexOf(searchKey.toUpperCase())!==-1)));
    }
    
  }
  public getSpecficParentCategoryQuestions(pcat: any){
    this.showCatagories = true;
    this.selectedCat = 'All';
    this.selectedParentCat = pcat;
    this.questionAnswers = this.allquestionAnswers.filter( (i: { parentcat: any; }) => i.parentcat === pcat);
    this.categories = [];
    for (let entry of this.questionAnswers) {
      if(this.categories.includes(entry.cat) !== true){
        this.categories.push(entry.cat);
      }
    }
    // this.router.navigate(['faq/'+pcat]);
  }

  reloadPage() {
    window.location.reload();
 }

}
