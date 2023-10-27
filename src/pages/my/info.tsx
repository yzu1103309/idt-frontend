import { useRef, useState } from 'react';
import { useNavbarTitle, useUser } from '@/hooks';
import Head from 'next/head';
import React from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Flex, MultiSelect, NumberInput, NumberInputHandlers,
  rem, Select,
  Space,
  Text,
  TextInput,
} from '@mantine/core';
import '@mantine/dates/styles.css';
import Link from 'next/link';
import { IconArrowRight, IconCheck, IconChevronLeft, IconForms } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { util } from 'zod';
import { isNanValue } from 'react-number-format/types/utils';
import { DatePickerInput } from '@mantine/dates';

function SurveyPage()
{
  const [qnum, setQnum] = useState(0);
  const [privacyCheck, setPrivacyCheck] = useState(false);

  const formValues = useForm(
    {
      initialValues: {
        name: '',
        phone: '',
        nickname: '',
        gender: '',
        birthday: new Date('2000-01-01T00:00:00Z'),
        height: 160,
        weight: 50,
        interests: [],
        avgHours: 10 as any,
        regularTime: [],
        level: [] as any
      }
    }
  )

  const timeOptions = [
    { value: "1", label: "上午6:00 ～ 上午8:00" },
    { value: "2", label: "上午8:00 ～ 上午10:00" },
    { value: "3", label: "上午10:00 ～ 中午12:00" },
    { value: "4", label: "中午12:00 ～ 下午2:00" },
    { value: "5", label: "下午2:00 ～ 下午4:00" },
    { value: "6", label: "下午4:00 ～ 下午6:00" },
    { value: "7", label: "下午6:00 ～ 晚上8:00" },
    { value: "8", label: "晚上8:00 ～ 晚上10:00" },
    { value: "9", label: "晚上10:00 ～ 午夜12:00" },
    { value: "10", label: "午夜12:00 ～ 上午2:00" },
    { value: "11", label: "上午2:00 ～ 上午4:00" },
    { value: "12", label: "上午4:00 ～ 上午6:00" },
  ];

  const levelOption = [
    { value: "1", label: "是新手小白" },
    { value: "2", label: "算是略知一二" },
    { value: "3", label: "技巧中規中矩" },
    { value: "4", label: "能力水準之上" },
    { value: "5", label: "Boss級高手" },
  ];

  const sports = [
    { value: "1", label: "籃球" },
    { value: "2", label: "排球" },
    { value: "3", label: "羽球" },
    { value: "4", label: "網球" },
    { value: "5", label: "游泳" },
    { value: "6", label: "直排輪" },
    { value: "7", label: "足球" },
    { value: "8", label: "桌球" },
    { value: "9", label: "棒球" },
    { value: "10", label: "壘球" },
    { value: "11", label: "躲避球" },
    { value: "12", label: "跆拳道" },
    { value: "13", label: "巧固球" },
    { value: "14", label: "保齡球" },
    { value: "15", label: "其他" },
  ];


  function handleNextQ()
  {
    let f = formValues.values;
    let errorMessage = '';
    switch (qnum)
    {
      case 0:
        if(!privacyCheck)
        {
          notifications.show({
            color: "red",
            title: '請詳閱隱私群政策！',
            message: '閱讀完記得勾選方框表示同意喔～'
          })
          return;
        }
        break;
      case 1:
        if(f.name.trim() === '') errorMessage += '姓名';
        if(f.phone.trim() === '') errorMessage +=  (errorMessage === '')? '手機': '、手機';
        if(f.nickname.trim() === '') errorMessage +=  (errorMessage === '')?'暱稱': '、暱稱';
        if(f.gender.trim() === '') errorMessage +=  (errorMessage === '')? '性別': '、性別';

        if(errorMessage !== '')
        {
          notifications.show({
            color: 'red',
            title: '尚有欄位未填寫！',
            message: errorMessage + '不可空白'
          });
          return;
        }
        else if(f.phone.length !== 10
        || isNaN(Number(f.phone))
        || f.phone[0] !== '0' || f.phone[1] !== '9')
        {
          notifications.show({
            color: 'red',
            title: '手機號碼不正確！',
            message: '請再檢查一次您的手機號碼'
          });
          return;
        }
        break;
      case 2:
        if(f.height < 30 || f.weight < 15 )
        {
          notifications.show({
            color: 'red',
            title: '身高或體重可能不正確！',
            message: '請再檢查一次您輸入的身高、體重～'
          });
          return;
        }
        break;
      case 3:
        if(!f.interests.length) errorMessage +=  (errorMessage === '')? '興趣': '、興趣';
        if(f.avgHours === '') errorMessage +=  (errorMessage === '')?'運動時長': '、運動時長';
        if(!f.regularTime.length) errorMessage +=  (errorMessage === '')? '運動時段': '、運動時段';
        if(errorMessage !== '')
        {
          notifications.show({
            color: 'red',
            title: '尚有欄位未填寫！',
            message: errorMessage + '不可空白'
          });
          return;
        }
        else if(f.avgHours >= 168)
        {
          notifications.show({
            color: 'red',
            title: '每週平均時長錯誤！',
            message: '再檢查一次吧～'
          });
          return;
        }
        formValues.setFieldValue('level', [] as any);
        break;
      case 4:
        console.log(f.level.filter( () => {return true} ))
        if(f.interests.length !== f.level.filter( () => {return true} ).length)
        {
          notifications.show({
            color: 'red',
            title: '尚有欄位未填寫喔！',
            message: '再檢查一遍是否所有題目都填寫了吧！'
          });
          return;
        }
    }
    if( qnum < 6)  setQnum(qnum+1);
  }

  return (
    <Container m={'lg'}>
      { qnum === 0 &&
        <><Alert variant="light" color="yellow" my="md">
          您還沒有填過問卷～
        </Alert>
        <Box style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '65vh',
        }}>
          <Text size={'xl'} fw={'1000'}>使用者個人資料設定及註冊問卷</Text>
          <Space h={'lg'}></Space>
          <Text fw={700}>此問卷資料攸關本平台後續各項功能運行之準確性</Text>
          <Text fw={700}>也會用於數據分析、改善平台功能等目的</Text>
          <Text fw={700}>請您如實填寫，謝謝！</Text>
          <Space h={'xl'}></Space>
          <Checkbox
            checked={privacyCheck} onChange={(event)=>setPrivacyCheck(event.currentTarget.checked)}
            label={<Text size={'sm'}>我們注重您的隱私，請先詳閱我們的 <Link style={{textDecoration: 'underline'}} href={'/privacy'}>隱私權政策</Link></Text>}
          ></Checkbox>
          <Button
            onClick={()=>{handleNextQ()}}
            variant={'gradient'} leftSection={<IconForms />}
            gradient={{ from: 'blue.3', to: 'blue.6', deg: 90 }}
            w={'70%'} mt={'xl'} rightSection={<IconArrowRight />}
          >
            我已知悉以上資訊，前往填寫
          </Button>
        </Box></>
      }
      { !!qnum &&
        <>
          {qnum === 1 &&
            <>
              <Text mt={'xl'} size={'xl'} ta={'center'} fw={700}>個人基本資料設定</Text>
              <TextInput
                radius={'md'}
                required mt={'md'}
                size={'md'}
                label={'真實姓名：'}
                {...formValues.getInputProps('name')}
              ></TextInput>
              <NumberInput maxLength={10} allowLeadingZeros={true}
                 radius={'md'} required mt={'md'} allowDecimal={false}
                 size={'md'} description={'範例格式：0912345678'}
                 label={'手機號碼：'} allowNegative={false} hideControls step={0}
                 {...formValues.getInputProps('phone')} type={'tel'}
              ></NumberInput>
              <TextInput
                radius={'md'}
                required mt={'md'}
                size={'md'}
                label={'暱稱：'} description={'在平台上的各項功能將顯示您的暱稱'}
                {...formValues.getInputProps('nickname')}
              ></TextInput>
              <Select mt={'md'}
                      label={'生理性別：'} withAsterisk
                      size={'md'} description={'將用於夥伴配對、數據分析'}
                      data={['男', '女']} allowDeselect={false}
                      {...formValues.getInputProps('gender')}
              ></Select>
            </>
          }
          {qnum === 2 &&
            <>
              <Text mt={'xl'} size={'xl'} ta={'center'} fw={700}>我的健康卡</Text>
              <DatePickerInput
                radius={'md'} valueFormat={'YYYY / MM / DD'}
                required mt={'md'}
                size={'md'} dropdownType={'modal'}
                label={'出生年月日：'}
                {...formValues.getInputProps('birthday')}
              ></DatePickerInput>
              <NumberInput
                 radius={'md'} type={'tel'}
                 required mt={'md'} allowDecimal={false}
                 size={'md'} allowNegative={false}
                 label={'身高：'}
                 {...formValues.getInputProps('height')}
              ></NumberInput>
              <NumberInput
                 radius={'md'} allowDecimal={false}
                 required mt={'md'}
                 size={'md'} allowNegative={false}
                 label={'體重：'}
                 {...formValues.getInputProps('weight')}
              ></NumberInput>
            </>
          }
          { qnum === 3 &&
            <>
              <Text mt={'xl'} size={'xl'} ta={'center'} fw={700}>運動習慣調查</Text>
              <MultiSelect mt={'md'} withAsterisk
                label={'請選擇您有興趣的運動（可複選）：'}
                size={'md'} data={sports}
                {...formValues.getInputProps('interests')}
              >
              </MultiSelect>
              <NumberInput
                 radius={'md'} allowDecimal={false}
                 required mt={'md'} prefix={'大約'} suffix={'小時'}
                 size={'md'} allowNegative={false}
                 label={'每週平均運動幾小時：'} max={168}
                 {...formValues.getInputProps('avgHours')}
              ></NumberInput>
              <MultiSelect
                mt={'md'} required withAsterisk
                label={'請選擇您平常運動的時段（可複選）：'}
                size={'md'} data={timeOptions}
                description={'將用於夥伴配對之參考'}
                {...formValues.getInputProps('regularTime')}
              >
              </MultiSelect>
            </>
          }
          { qnum === 4 &&
            <>
              <Text mt={'xl'} size={'xl'} ta={'center'} fw={700}>運動經驗自評</Text>
              <Text mt={'sm'} mb={'xl'} size={'md'} ta={'center'} fw={500}>依照先前您選擇有興趣的運動，我們將詢問您對於各項運動的經驗值<br />作為後續夥伴配對之參考，以及進行大數據分析</Text>
              { formValues.values.interests.map( (item: string, index: number) => (
                <>
                  <Select
                    withAsterisk allowDeselect={false}
                    mt={'md'} size={'md'} data={levelOption}
                    label={<>對於{ sports.find( (value) => (value.value === item))?.label }，您認為您：</>}
                    {...formValues.getInputProps('level.'+index) }
                  ></Select>
                </>)
              )}
            </>
          }
          { qnum === 5 &&
            <Text mt={'xl'} size={'xl'} ta={'center'} fw={700}>平時生活區域</Text>
          }
          { qnum === 6 &&
            <Text mt={'xl'} size={'xl'} ta={'center'} fw={700}>在運動方面，曾經遇過的困難點</Text>
          }
          <Group justify="space-evenly" mt="xl">
            <Button
              onClick={()=>(setQnum(qnum-1))}
              leftSection={<IconChevronLeft />}
              w={"45%"}
            >
              回上一步
            </Button>
            <Button
              onClick={()=>handleNextQ()}
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange', deg: 90 }}
              rightSection={<IconCheck />}
              w={"45%"}>
              { qnum !== 6 && <>確定</>}
              { qnum === 6 && <>提交表單</>}
            </Button>
          </Group>
        </>
      }
    </Container>
  );
}

function ProfilePage()
{
  return (
    <></>
  );
}

export default function InfoPage()
{
  const { user, mutate: refreshUser } = useUser();

  let title = "使用者的個人資料";
  if(!user?.profileCompleted)
    title = "註冊問卷";

  useNavbarTitle(title);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        { !user &&
          <Box style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '70vh',
          }}>
            {(
              <>
                <Alert
                  color="blue" fw={500}>
                  看起來您還沒登入喔！前往
                  <Link href = '/signin'> 註冊/登入</Link>
                </Alert>
              </>
            )}
          </Box>
        }
        { !!user &&
          <>
            { !!user.profileCompleted &&
              <ProfilePage></ProfilePage>
            }
            { !user.profileCompleted &&
              <SurveyPage></SurveyPage>
            }
          </>
        }
      </main>
    </>
  );
}
