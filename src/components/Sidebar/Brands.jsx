import React from "react";

function Brands() {
  const storeData = {
    id: 1.2,
    store_img:
      "https://zipapi.youstee.com/public/uploads/1734692083762Screenshot 2024-12-20 at 4.22.12â¯PM.png",
    store_link:
      "https://betworld.pro/go/1fd210f73517426bdb4ae4242aaa9b3e365b64d1eb0a0b0b/?subid={publisher_id}_{source}&tid={click_id}",
    store_name: "Lopebet",
    about_store:
      "You can now play all Lopebet games online for real money at Xpediagame with no more charges for the games. Regardless of whether you are fond of solving strategic puzzles or just aim of entertain yourself with simple fun games, Xpediagame is your reliable online source of Lopebet games accessible at any time and anywhere. Search for and download a number of Lopebet online games and enjoy all the fun without paying a single cent. Experience the fun and excitement in Lopebet games for free today and discover the fun and excitement of challenging games to win. Are you still hesitant? Do not waste time, it is time to start playing online Lopebet games and what can be better? You should visit Xpediagame today to play the most amazing Lopebet games with no cost.",
    term_conditions: [
      "Cash Out Feature: Winmatch reserves the right to withdraw, disable, or suspend the Cash Out feature at its discretion, without liability, and does not guarantee its availability or acceptance of cash-out requests.",
      "Multiple Bets: The terms apply to Multiple Bets, with voided bets adjusted accordingly. Winmatch holds the right to void bets due to obvious errors, suspected fraud, or breaches. The maximum payout for a complete Multiple Bet is USD$10,000, and the cash-out tool is not available for Multiple Bets.",
      "Suspension and Termination: Winmatch may suspend or terminate accounts for various reasons, including suspected fraud, breach of terms, illegal activities, or incomplete verification. In case of termination, unmatched bets may be canceled, and winnings withheld.",
      "Account Closure: Customers may close their Winmatch accounts with 24 hours' notice, provided there's no negative balance or money owed to Winmatch.",
      "Segregated Accounts: Customer funds are held in segregated accounts, with different protections for Great Britain and other customers, meeting regulatory requirements. Users should be aware of the potential risk in case of Winmatch or its associates' insolvency.",
    ],
    store_live: "true",
  };

  return (
    <div className="container my-4">
      <div className="card mb-3" style={{ maxWidth: "100%" }}>
        <div className="row g-0">
          {/* Image Section */}
          <div className="col-md-4">
            <img
              src={storeData.store_img}
              className="img-fluid rounded-start"
              alt={storeData.store_name}
              style={{ height: "100%", objectFit: "cover" }}
            />
          </div>
          {/* Content Section */}
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{storeData.store_name}</h5>
              <p className="card-text">
                {storeData.about_store.slice(0, 100)}...
              </p>
              <ul className="list-group list-group-flush mb-3">
                {storeData.term_conditions.slice(0, 3).map((term, index) => (
                  <li key={index} className="list-group-item">
                    {term}
                  </li>
                ))}
              </ul>
              <a
                href={storeData.store_link}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Store
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Brands;
