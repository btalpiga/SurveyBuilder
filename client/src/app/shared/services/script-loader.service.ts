import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'typedarray', src: 'https://cdn.rawgit.com/inexorabletash/polyfill/master/typedarray.js' },
  { name: 'knockout', src: 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js' },
  { name: 'Chart', src: 'https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js' },
  { name: 'd3', src: 'https://unpkg.com/d3@5.9.2/dist/d3.min.js' },
  { name: 'c3', src: 'https://unpkg.com/c3@0.7.1/c3.js' },
  { name: 'plotly', src: 'https://cdn.plot.ly/plotly-latest.min.js' },
  { name: 'wordcloud2', src: 'https://unpkg.com/wordcloud@1.1.0/src/wordcloud2.js' },
  // { name: 'analytics', src: '../../../packages/survey.analytics.js' },
  { name: 'polyfill', src: 'https://polyfill.io/v3/polyfill.min.js' }
];

declare var document: any;

@Injectable()
export class DynamicScriptLoaderService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
            script.onreadystatechange = () => {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    this.scripts[name].loaded = true;
                    resolve({script: name, loaded: true, status: 'Loaded'});
                }
            };
        } else {  //Others
            script.onload = () => {
                this.scripts[name].loaded = true;
                resolve({script: name, loaded: true, status: 'Loaded'});
            };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

}