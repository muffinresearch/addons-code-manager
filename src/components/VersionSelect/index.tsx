import * as React from 'react';
import { Col, Form } from 'react-bootstrap';

import { VersionsList } from '../../reducers/versions';
import { gettext } from '../../utils';

type PublicProps = {
  label: string;
  listedVersions: VersionsList;
  unlistedVersions: VersionsList;
};

class VersionSelectBase extends React.Component<PublicProps> {
  render() {
    const { label, listedVersions, unlistedVersions } = this.props;

    return (
      <Form.Group as={Col}>
        <Form.Control as="select">
          <option>{label}</option>
          {listedVersions.length && (
            <optgroup label={gettext('Listed')}>
              {listedVersions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.version}
                </option>
              ))}
            </optgroup>
          )}
          {unlistedVersions.length && (
            <optgroup label={gettext('Unlisted')}>
              {unlistedVersions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.version}
                </option>
              ))}
            </optgroup>
          )}
        </Form.Control>
      </Form.Group>
    );
  }
}

export default VersionSelectBase;
