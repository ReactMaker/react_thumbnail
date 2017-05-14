import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Button } from 'antd';

import './FileInfo.less';

export default class FileInfo extends Component {
  static propTypes = {
    content: PropTypes.object,
    removeFile: PropTypes.func,
  }

  render() {
    const { content, removeFile } = this.props;
    const mimeType = content.file.type.split('/')[0];

    return (
      <Row className="info_container">
        <Col xs={8} sm={8} className="image_content">
          <img src={content.thumbnail} alt={content.file.name} />
        </Col>
        <Col xs={15} sm={15} className="file_content">
          <p>
            {
              mimeType === 'image'
              ? <Icon type="picture" className="picture"/>
              : <Icon type="video-camera" className="video"/>
            }
            {content.file.name} / {(content.file.size / 1024 / 1024).toFixed(3)}MB
          </p>
        </Col>
        <Col xs={1} sm={1}>
          <Button shape="circle" onClick={removeFile}>
            <Icon type="close" />
          </Button>
        </Col>
      </Row>
    );
  }
}
