import * as React from 'react';
import { shallow } from 'enzyme';
import { Form } from 'react-bootstrap';

import configureStore from '../../configureStore';
import {
  ExternalVersionsList,
  actions as versionActions,
} from '../../reducers/versions';
import { fakeVersionsList } from '../../test-helpers';

import VersionSelect from '.';

describe(__filename, () => {
  const render = ({
    label = 'select a version',
    versions = fakeVersionsList,
  } = {}) => {
    const addonId = 123;
    const store = configureStore();
    store.dispatch(versionActions.loadVersionsList({ addonId, versions }));
    const versionsLists = store.getState().versions.byAddonId[addonId];

    const allProps = {
      label,
      listedVersions: versionsLists.listed,
      unlistedVersions: versionsLists.unlisted,
    };

    return shallow(<VersionSelect {...allProps} />);
  };

  it('renders a select form control', () => {
    const root = render();

    expect(root.find(Form.Control)).toHaveLength(1);
    expect(root.find(Form.Control)).toHaveProp('as', 'select');
  });

  it('renders a label as first option', () => {
    const label = 'some label';
    const root = render({ label });

    expect(root.find('option').at(0)).toIncludeText(label);
  });

  it('renders two lists of versions', () => {
    const listedVersions: ExternalVersionsList = [
      {
        id: 123,
        channel: 'listed',
        version: 'v1',
      },
    ];
    const unlistedVersions: ExternalVersionsList = [
      {
        id: 456,
        channel: 'unlisted',
        version: 'v2',
      },
    ];

    const root = render({ versions: [...listedVersions, ...unlistedVersions] });

    expect(root.find('optgroup').at(0)).toHaveProp('label', 'Listed');
    expect(root.find('option').at(1)).toHaveProp('value', listedVersions[0].id);
    expect(root.find('option').at(1)).toIncludeText(listedVersions[0].version);

    expect(root.find('optgroup').at(1)).toHaveProp('label', 'Unlisted');
    expect(root.find('option').at(2)).toHaveProp(
      'value',
      unlistedVersions[0].id,
    );
    expect(root.find('option').at(2)).toIncludeText(
      unlistedVersions[0].version,
    );
  });
});
