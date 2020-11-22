import { TwitterSentiment } from './model/TwitterSentiment';
import { Component} from '@angular/core';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'airlineSentimentUI';
  tweet ="";
  showAlert = false;
  alertMessage = "";
  twitterSentiments: TwitterSentiment[] = [];

  constructor(private httpClient: HttpClient) { }

  send() {
    if(this.tweet.length > 280) {
      this.showAlert = true;
      this.alertMessage = "Only 280 characters allowed!";
      timer(3000).pipe(first()).subscribe(() => this.showAlert = false);
      return;
    }
    if(this.tweet.length < 4) {
      this.showAlert = true;
      this.alertMessage = "Please enter at least 5 chars!";
      timer(3000).pipe(first()).subscribe(() => this.showAlert = false);
      return;
    }

    const formData = new FormData();
    
    const tweet = this.tweet;
    this.tweet = "";
    formData.append('text', tweet);
    this.httpClient.post<TwitterSentiment>("https://api.wiechula.com/predict", formData).subscribe(
      (res) => {
        res.tweet = tweet;
        this.twitterSentiments.push(res);
      }
        ,
      (err) => { 
        this.showAlert = true;
        this.alertMessage = "There was an issue with the Backend Connection";
        timer(3000).pipe(first()).subscribe(() => this.showAlert = false);
       }
    );
  }
  isUnk(sentiment) {
    return sentiment.airline_sentiment_predictions !== 'negative' && sentiment.airline_sentiment_predictions !== 'positive';
  }
}
