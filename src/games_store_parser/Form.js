import AdditionalFilter from "./AdditionalFilter";

const styles = {
    blockCenter: {
        textAlign: 'center'
    },

    blockView: {
        border: '1px solid #ccc',
        padding: '.5rem 1rem',
        borderRadius: '5px',
        margin: '.5rem'
    }
}

export default function Form(props) {
    return(
        <div>
            <h2 style={styles.blockCenter}>Парсинг статистики отзывов игровых платформ</h2>
            <br />
            <form onSubmit={props.getReviewsInfo}>
                <div className="row">
                    <div className="col-sm-3">
                        <div style={styles.blockView}>
                            <label htmlFor="inputAppId" className="form-label"><strong>Выберите Store</strong></label>
                            {
                                props.gameStores.map(store => {
                                    return(
                                        <div className="mb-3 form-check" key={store.id}>
                                            <input type="checkbox" className="form-check-input store-checkbox"
                                                   id={store.id} name={store.id} onChange={() => props.storeCLick(store.id)}
                                                   checked={store.checked} />
                                            <label className="form-check-label" htmlFor={store.id}>{store.name}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div style={styles.blockView}>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label htmlFor="inputAppId" className="form-label"><strong>Id
                                        приложения/игры</strong></label>
                                    <input className="form-control" id="inputAppId" name="inputAppId"
                                           placeholder="пример: Google Play - com.miniclip.plagueinc; App Store - 525818839; Steam - 939850" />
                                </div>
                            </div>
                            <br />
                            <AdditionalFilter checked={props.gameStores} steamRemoveEnglish={props.steamRemoveEnglish}
                                              steamAllTime={props.steamAllTime}
                                              setSteamDateRange={props.setSteamDateRange}
                                              /*googlePlayFoundByFilter={props.googlePlayFoundByFilter}*/ />
                            <br />
                            <div className="row">
                                <div className="col-sm-12" style={styles.blockCenter}>
                                    <button className="btn btn-primary">Выгрузить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}