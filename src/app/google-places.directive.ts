/// <reference types="@types/googlemaps" />
import { Directive, ElementRef, OnInit , Output, EventEmitter} from '@angular/core';

 //const google = require('@types/googlemaps');
import {} from "googlemaps";
declare var google: any;
@Directive({
  selector: '[google-place]'
})
export class GooglePlacesDirective implements OnInit {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;
  

  constructor(private elRef: ElementRef) {

    this.element = elRef.nativeElement;

   }

   getFormattedAddress(place) {
    //@params: place - Google Autocomplete place object
    //@returns: location_obj - An address object in human readable format
    console.log(place)
    let location_obj = {
      lat:'',
      lng:''
    };
    let geometry = {};
    for (let i in place.address_components) {
      let item = place.address_components[i];
      console.log(place.address_components[i])
      location_obj['formatted_address'] = place.formatted_address;
      if(item['types'].indexOf("locality") > -1) {
        location_obj['locality'] = item['long_name']
      } else if (item['types'].indexOf("administrative_area_level_1") > -1) {
        location_obj['admin_area_l1'] = item['long_name']
      } else if (item['types'].indexOf("street_number") > -1) {
        location_obj['street_number'] = item['short_name']
      } else if (item['types'].indexOf("route") > -1) {
        location_obj['route'] = item['long_name']
      } else if (item['types'].indexOf("country") > -1) {
        location_obj['country'] = item['long_name']
      } else if (item['types'].indexOf("postal_code") > -1) {
        location_obj['postal_code'] = item['short_name']
      } else if (item['types'].indexOf("geometry") > -1) {
        location_obj['geometry'] = item['geometry']
      } 
     
    }
     
     // console.log(place.geometry)
      // get lat
      location_obj.lat = place.geometry.location.lat();
      //console.log(location_obj.lat)
      // get lng
      location_obj.lng = place.geometry.location.lng();
      // console.log(location_obj.lng)
      // console.log(location_obj)
    return location_obj;
  }

  ngOnInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.element);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // Emit the new address object for the updated place
      this.onSelect.emit(this.getFormattedAddress(autocomplete.getPlace()));
      console.log(autocomplete.getPlace())
    });
  }

}
