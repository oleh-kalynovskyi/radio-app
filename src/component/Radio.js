import React, { Component } from 'react';
import { RadioBrowserApi } from 'radio-browser-api';
import ReactAudioPlayer from 'react-audio-player';

import { FcLike } from 'react-icons/fc';
import { FcDislike } from 'react-icons/fc';

export default class Radio extends Component {

    state = {
        all: [],
        likeRadio: [],
        stationTag: [], 
        value: "",
        Theme: {},
    };

    componentDidMount () {
        this.getStations()
        const likeRadio = JSON.parse(localStorage.getItem('likeRadio'))
        if(likeRadio) {
            this.setState({ 
                likeRadio
            });
        }
    };

    getStations = async () => {
        let {stationTag} = this.state
        const api = new RadioBrowserApi(fetch.bind(window),'My Radio App')
        const stations = await api.searchStations({
          tag: stationTag === "All" ? '' : stationTag,
          limit: 20,
          offset: 0,
          name: this.state.value
        })

        this.setState({ 
            all: stations,
        });
    }

    addRadioList = async (el) => {
        await this.setState({
            likeRadio: [...this.state.likeRadio, this.state.all.find( station => station.id === el.id)]
        });
        localStorage.setItem("likeRadio", JSON.stringify(this.state.likeRadio));
    };
    removeFromRadioList = async (el) => {
        await this.setState({
            likeRadio: this.state.likeRadio.filter(station => station.id !== el.id)
        });
        localStorage.setItem("likeRadio", JSON.stringify(this.state.likeRadio));
    };

    // type fm stations
    filter = [
        "All",
        "classical",
        "dance",
        "disco",
        "house",
        "jazz",
        "pop",
        "rap",
        "90s",
        "rock",
    ];

    // search station
    filteredList = (e) => {
        this.getStations()
        this.setState({ value: e.target.value })
    };


    darkTheme = () => {
        this.setState({ Theme: {
            backgroundPlayer: 'rgb(98, 57, 48)',
            buttonBackground: 'rgb(104, 57, 108)',
            buttonColor: 'white'
        }})
        document.body.style = 'background: rgb(51, 51, 47);color: white;';
    };
    lightTheme = () => {
        this.setState({ Theme: {
            backgroundPlayer: 'rgb(151, 165, 193)',
            buttonBackground: 'rgb(94, 158, 186)',
            buttonColor: 'rgb(0, 0, 0 )'
        }})
        document.body.style = 'background: rgb(197, 207, 198 );color: rgb(0, 0, 0 );';

    };
    ClassicTheme = () => {
        this.setState({ Theme: {
            backgroundPlayer: '',
            buttonBackground: '',
            buttonColor: ''
        }})
        document.body.style = 'background: ; color: ;';
    };


    checkLike = (el) => {
        const likeIdis = this.state.likeRadio.map(el => el.id)
        if( !likeIdis.includes(el.id) ) {
            return <FcLike onClick={() => this.addRadioList(el)}
                className="FcDislike" 
                title="Save station"/> 
        } else {
            return <FcDislike onClick={() => this.removeFromRadioList(el)}
                className="FcDislike"
                title="Remove from saved"
                />
        }
    }

    render() {
        return (
            <>
            <div className="skin-search-wrapper">
                <div className="skin">
                    <span>Choose Theme:</span>
                    <label htmlFor="Light"> <input
                        id="Light"
                        type="radio" 
                        name="Theme"
                        onChange={ this.lightTheme }/> 
                        Light</label>

                    <label htmlFor="Dark"> <input 
                        id="Dark" 
                        type="radio" 
                        name="Theme"
                        onChange={ this.darkTheme }
                        /> Dark</label>

                    <label htmlFor="Classic"> <input 
                        id="Classic" 
                        type="radio" 
                        name="Theme" 
                        onChange={ this.ClassicTheme }/> 
                        Classic</label>
                </div>

                <div className="search">
                    <input value={this.state.value} onChange={ this.filteredList } placeholder="Find radio station"/>
                </div>
            </div>

            <div className="filter">
                <p>Select Radio:</p>
                <div className="filter-items">
                    {this.filter.map( el => (
                        <button
                            className={this.state.stationTag === el ? 'button-active' : ''}
                            key={el}
                            onClick={ () => this.setState({ stationTag: (el) }, ()=> this.getStations()) }
                            style={{ 
                                background: this.state.Theme.buttonBackground, 
                                color: this.state.Theme.buttonColor,
                            }}>
                            {el} 
                        </button>
                    ))}
                </div>
            </div>

            <ul className="likeRadio">
                <p className="likeRadio-text">Saved Stations: { this.state.likeRadio.length > 0 ? '' : "add favorite radio" } </p>
                {this.state.likeRadio.map( el => (
                    <li key={el.id} className="likeRadio-item"> 
                        <FcDislike onClick={ () => this.removeFromRadioList(el) }
                            className="FcDislike" 
                            title="Remove from saved"/>
                        <span> 
                            Station Name: {el.name}
                        </span>
                        <span>
                            Music: {el.tags.join(', ')} 
                        </span>
                        <span>
                            Country: {el.country}
                        </span>

                        <ReactAudioPlayer
                            src={el.urlResolved} 
                            controls
                        />
                    </li>
                ))}
            </ul>

            <ul className="radio-list">
                { this.state.all.map(el => (
                <li key={el.id} className="radio-item" style={{ background: this.state.Theme.backgroundPlayer }}>

                    <p>
                        {this.checkLike(el)}
                    </p>

                    <span className="station-name">
                        Station Name: {el.name} 
                    </span>
                    <span className="music-tags">
                        Music: {el.tags.join(', ')}
                    </span>
                    <span className="country-radio">
                        Country: {el.country}
                    </span>

                    <ReactAudioPlayer
                        src={el.urlResolved} 
                        controls
                    />
                </li>
                ))}
            </ul>
            </>
        )
    }
}
