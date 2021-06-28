import "./homepage.css"

export const Homepage = () =>{
    return(
            <main>
                <h2>Welcome to Games4Everyone</h2>
                <div id ="homePageIntro">
                    <p>At Games4Everyone we believe that board-games are a unique way of getting family and friends together.</p>
                    <p>When board games get brought up in discussion there's 2 extremes that come to mind, Monopoly and Dungeons and Dragons.
                         One is super casual (Monopoly) and the other is super deep.</p>
                    <p> We are here to show you that there is a middleground, where everyone from all ages can explore
                         and experience the vast amount of board games there are in the market.</p>
                </div>
                
               <div className="explorePromo">
                    <div className="explorePromoBox" id="casuals" >
                         <p>Monopoly wasn't created to be "fun", it was created to show the harm of monopolies,<br /> but it's easy to pick-up and easy to play,
                          how about we show you some alternatives?</p>
                         <button>Games 4 Replacing Monopoly</button>
                    </div>
                    <div className="explorePromoBox" id="adventurers">
                         <p>You want board-games that have more depth to them?</p>
                         <button>Games 4 Adventurers</button>
                    </div>
                    <div className="explorePromoBox" id="experts" >
                         <p>Do you enjoy reading 50 pages of rules, and spending hours if not days on a single game?</p>
                         <button>Games 4 Experts</button>
                    </div>
                    
               </div>
                
            </main>
        
    );
}