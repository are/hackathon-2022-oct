import React, { useCallback, useState } from 'react'
import { TbDownload } from 'react-icons/tb'
import { ops } from '../canvas/operations'

import { useWhiteboard } from '../context'
import { Button } from '../styles'

export function DownloadImage() {
  const { download } = useWhiteboard(
    {
      name: 'DownloadImage',
    },
    []
  )

  const onClick = useCallback(() => {
    download()
  }, [download])

  return (
    <Button onClick={onClick} active={0}>
      <TbDownload size={22} />
    </Button>
  )
}
