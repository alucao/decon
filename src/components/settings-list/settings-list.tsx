import './settings-list.css';
import { setSettings, clearDb } from '../../api/data-gatherer'
import { getSettings } from '../../api/settings'
import { useState, useEffect } from 'react';

function SettingsList({closeSettings, refreshQueries}) {

  const [selectOption, setSelectOption] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [isProd, setIsProd] = useState(true);

  useEffect(() => {
    const setOption = async () => {
      let settings = await getSettings();
      setSelectOption(settings.provider);
      setApiKeyValue(settings.apiKey);
      setIsProd(settings.isProd);
    };

    setOption();
  }, []);

  const handleSaveButtonClick = () => {
    setSettings(isProd, selectOption, apiKeyValue);
  };

  const handleClearDbClick = async () => {
    await setSettings(isProd, selectOption, apiKeyValue);
    await clearDb();
    refreshQueries();
    closeSettings();
  };

  return (<div className="settings-list">
    <span className="setting">
      <span className="setting-row">
      <b>Data provider:</b>
      <select value={selectOption} onChange={(event) => setSelectOption(event.target.value)}>
        <option value="BLOCKFROST">Blockfrost</option>
        <option value="KOIOS">Koios</option>
      </select>
      </span>

      <span className="setting-row">
      API key: <input value={apiKeyValue} onChange={(event) => setApiKeyValue(event?.target.value)} />
      </span>

      <span className="setting-row">
      <input
          type="checkbox"
          checked={!isProd}
          onChange={() => setIsProd(!isProd)}
        /> Cardano preprod [requires DB reset]
      </span>

      <button type="button" className="btn btn-dark" onClick={handleSaveButtonClick} >
        Save
      </button>
    </span>

    <span className="setting">
      <button type="button" className="btn btn-dark" onClick={handleClearDbClick} >
        Clear local DB
      </button>
    </span>
 
    <br/>

    <span className="setting">
      <button type="button" className="btn btn-dark" onClick={closeSettings} >
        Close settings
      </button>
    </span>

  </div>)
}

export default SettingsList;
