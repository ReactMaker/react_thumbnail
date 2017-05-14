import React, { Component } from 'react';
import { Upload, message, Button, Icon, Row, Col } from 'antd';
import FileInfo from './components/FileInfo';

import './Home.less';

const Dragger = Upload.Dragger;
const contentTypeList = ['video/mp4', 'image/jpg', 'image/jpeg', 'image/png'];

export default class Home extends Component {
  state = {
    fileList: [],
  }

  beforeUpload = (file) => {
    const mimeType = file.type.split('/')[0];

    if (mimeType === 'video') {
      this.handleVideoUpload(file);
    } else if (mimeType === 'image') {
      this.handleImageUpload(file);
    }
  }

  handleImageUpload = (file) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      this.setState({
        fileList: [
          ...this.state.fileList, {
            file,
            thumbnail: reader.result,
          }
        ]
      });
    }, false);

    reader.readAsDataURL(file);
  }

  handleVideoUpload = (file) => {
    // 製作假的html5 video元素
    const video = document.createElement('video');
    video.preload = 'metadata';

    // 讀取video元素的metadata (or use onloadedmetadata)
    video.onloadeddata = () => {
      // 將url object 銷毀，避免佔用記憶體
      URL.revokeObjectURL(file);
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      canvas.getContext('2d').drawImage(video, 0, 0, 150, 150);

      this.setState({
        fileList: [
          ...this.state.fileList, {
            file,
            duration: video.duration,
            thumbnail: canvas.toDataURL(),
          }
        ]
      });
    };

    // 將上傳的檔案轉成url object
    video.src = `${URL.createObjectURL(file)}#t=20`;
  }

  removeFile = (index) => {
    const { fileList } = this.state;

    this.setState({
      fileList: [
        ...fileList.slice(0, index),
        ...fileList.slice(index + 1),
      ]
    });
  }

  render() {
    const { fileList } = this.state;

    return (
      <div id="pageHome">
        <Dragger
          multiple
          showUploadList={false}
          beforeUpload={this.beforeUpload}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">點擊或拖移檔案至此</p>
          <p className="ant-upload-hint">支援類型：.jpg, .png, .mp4</p>
        </Dragger>
        <Row>
          {
            fileList.map((content, index) => (
              <Col xs={12} md={12} className="file_info">
                <FileInfo
                  content={content}
                  removeFile={() => this.removeFile(index)}
                />
              </Col>
            ))
          }
        </Row>
      </div>
    );
  }
}
