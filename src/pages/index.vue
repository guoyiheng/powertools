<!-- eslint-disable no-console -->
<script setup lang="ts">
import fs from 'fs'
import { parseTime } from '@/utils/index'
import { chooseType, newPath, oldPath } from '@/composables'

// 表单数据
const oldPathError = ref('')
const newPathError = ref('')
watch(oldPath, () => {
  console.log('===')

  oldPathError.value = ''
})
watch(newPath, () => {
  newPathError.value = ''
})

// file type
const costomizeType = ref('')
const fileCount = ref(0)
const isMoving = ref(false)
const isFinish = ref(false)

const allTypeOption = [
  { value: 'video', label: '视频' },
  { value: 'image', label: '图片' },
  { value: 'audio', label: '音频' },
  { value: 'zip', label: '压缩文件' },
]
const allTypes = new Map([
  ['video', ['.mp4', '.avi', '.mkv', '.rmvb', '.rm', '.mov', '.wmv', '.flv', '.3gp', '.webm', '.ts', '.m4v']],
  ['image', ['.png', '.jpg', '.gif', '.jpeg', '.bmp']],
  ['audio', ['.wav', '.flac', '.mp3', '.aac']],
  ['zip', ['.rar', '.zip', '.7z', '.iso']],
])

/**
 * 提交按钮
 */
function handleMove() {
  // 重置错误信息
  oldPathError.value = ''
  oldPathError.value = ''
  fileCount.value = 0

  if (oldPath.value === '') {
    oldPathError.value = '目录不存在'
    return
  }
  if (newPath.value === '') {
    newPathError.value = '目录不存在'
    return
  }

  const chooseTypeFlat = chooseType.value.map(choose => allTypes.get(choose)).flat()
  const finalChooseType = [...chooseTypeFlat, ...costomizeType.value.split(',')].filter(type => type)

  if (finalChooseType.length === 0)
    return

  // 新建文件夹,根据当天命名
  const currentTime = new Date()
  const folderName = parseTime(currentTime, '{y}_{m}_{d}_{h}_{i}_{s}')
  const finalPath = `${newPath}\\${folderName}`
  console.log('源目录:', oldPath.value)
  console.log('目的目录:', finalPath)
  console.log('finalChooseType:', finalChooseType)
  makeDir(finalPath)
  isMoving.value = true
  moveFile(finalPath, oldPath.value, finalChooseType as string[])
  isMoving.value = false
  isFinish.value = true
}

// 新建文件夹
function makeDir(name: string) {
  try {
    fs.mkdirSync(name)
  }
  catch (error) {
    console.log(error)
    newPathError.value = error as string
  }
}

// 确定文件的格式是否是所选的
function fileWithChooseType(name: string, types: string[]) {
  let meetConditions = false
  for (let index = 0; index < types.length; index++) {
    const suffix = types[index].key
    if (name.endsWith(suffix))
      meetConditions = true
  }
  return meetConditions
}

// 主要函数-处理文件移动
function moveFile(finalPath: string, oldPath: string, finalChooseType: string[]) {
  try {
    const downloadDirArr = fs.readdirSync(oldPath, { withFileTypes: true })
    for (let index = 0; index < downloadDirArr.length; index++) {
      const dir = downloadDirArr[index]
      if (dir.isDirectory()) {
        const deepPath = `${oldPath}\\${dir.name}`
        // 递归查询
        moveFile(finalPath, deepPath, finalChooseType)
      }
      else {
        // 找到符合所选格式文件
        const oldName = `${oldPath}\\${dir.name}`
        const newName = `${finalPath}\\${dir.name}`

        if (fileWithChooseType(dir.name, finalChooseType)) {
          try {
            fs.renameSync(oldName, newName)
            // 移动文件
            fileCount.value += 1
          }
          catch (error) {
            console.log('rename failed!!!', dir, error)
            oldPathError.value = error as string
          }
        }
      }
    }
  }
  catch (error) {
    console.log(error)
    oldPathError.value = error as string
  }
}
</script>

<template>
  <div flex="~ col gap-4">
    <div flex="~ col gap-1">
      <n-input-group w-400px>
        <n-input-group-label>
          源目录
        </n-input-group-label>
        <n-input v-model:value="oldPath" placeholder="请输入源目录" />
      </n-input-group>
      <n-tag v-show="oldPathError!==''" type="error" style="width: fit-content">
        {{ oldPathError }}
      </n-tag>
    </div>
    <div flex="~ col gap-1">
      <n-input-group w-400px>
        <n-input-group-label>
          目的目录
        </n-input-group-label>
        <n-input v-model:value="newPath" placeholder="请输入目的目录" />
      </n-input-group>
      <n-tag v-show="newPathError!==''" type="error" style="width: fit-content">
        {{ newPathError }}
      </n-tag>
    </div>
    <div flex="~" w-full>
      <n-card embedded w-600px>
        <div flex="~ col gap-4">
          <n-checkbox-group v-model:value="chooseType">
            <n-space item-style="display: flex;">
              <n-checkbox v-for="item in allTypeOption" :key="item.value" :value="item.value" :label="item.label" />
            </n-space>
          </n-checkbox-group>
          <n-input-group w-400px>
            <n-input-group-label>
              自定义后缀资源
            </n-input-group-label>
            <n-input v-model:value="costomizeType" placeholder="多个后缀用逗号分割" />
          </n-input-group>
        </div>
      </n-card>
    </div>

    <div>
      <n-button type="primary" :loading="isMoving" @click="handleMove">
        开始移动文件
      </n-button>
    </div>
    <div>
      <n-alert v-show="isFinish" mt4 title="移动完成" type="success">
        <p>一共移动了{{ fileCount }}个文件</p>
      </n-alert>
    </div>
  </div>
</template>
