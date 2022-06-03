import React from 'react'
import styled from 'styled-components'
import { Button } from '../styled'
import { Modal } from './index'

const ReportCommentModal = ({ onReport, onClose }) => {
  return (
        <Modal
            title="Report comment?"
            subtitle="The comment will be reviewed by leerly"
        >
            <Button onClick={onReport}>Report</Button>
            <Button secondary onClick={onClose}>Close</Button>
        </Modal>
  )
}

export default ReportCommentModal
